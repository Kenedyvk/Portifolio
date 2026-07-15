"use strict";

const rooms = [
  { id: "principal", name: "Sala Principal", location: "1º andar", capacity: 12 },
  { id: "executiva", name: "Sala Executiva", location: "2º andar", capacity: 6 },
  { id: "auditorio", name: "Auditório", location: "Térreo", capacity: 50 }
];

const STORAGE_KEYS = {
  bookings: "roomflow_bookings_v1",
  settings: "roomflow_settings_v1"
};

const elements = {
  bookingForm: document.querySelector("#bookingForm"),
  settingsForm: document.querySelector("#settingsForm"),
  title: document.querySelector("#title"),
  organizer: document.querySelector("#organizer"),
  userPhone: document.querySelector("#userPhone"),
  date: document.querySelector("#date"),
  room: document.querySelector("#room"),
  startTime: document.querySelector("#startTime"),
  endTime: document.querySelector("#endTime"),
  participants: document.querySelector("#participants"),
  capacityFeedback: document.querySelector("#capacityFeedback"),
  videoConference: document.querySelector("#videoConference"),
  videoOptions: document.querySelector("#videoOptions"),
  videoPlatform: document.querySelector("#videoPlatform"),
  meetingLink: document.querySelector("#meetingLink"),
  itSupport: document.querySelector("#itSupport"),
  cateringSupport: document.querySelector("#cateringSupport"),
  cateringOptions: document.querySelector("#cateringOptions"),
  cateringNotes: document.querySelector("#cateringNotes"),
  notes: document.querySelector("#notes"),
  whatsappConsent: document.querySelector("#whatsappConsent"),
  formMessage: document.querySelector("#formMessage"),
  roomList: document.querySelector("#roomList"),
  bookingList: document.querySelector("#bookingList"),
  nextMeeting: document.querySelector("#nextMeeting"),
  todayCount: document.querySelector("#todayCount"),
  roomCount: document.querySelector("#roomCount"),
  cateringCount: document.querySelector("#cateringCount"),
  itCount: document.querySelector("#itCount"),
  cateringPhone: document.querySelector("#cateringPhone"),
  itPhone: document.querySelector("#itPhone"),
  settingsMessage: document.querySelector("#settingsMessage"),
  confirmationModal: document.querySelector("#confirmationModal"),
  confirmationDetails: document.querySelector("#confirmationDetails"),
  whatsappActions: document.querySelector("#whatsappActions"),
  closeModalButton: document.querySelector("#closeModalButton"),
  finishModalButton: document.querySelector("#finishModalButton"),
  openBookingButton: document.querySelector("#openBookingButton"),
  clearBookingsButton: document.querySelector("#clearBookingsButton")
};

let bookings = loadJson(STORAGE_KEYS.bookings, []);
let settings = loadJson(STORAGE_KEYS.settings, {
  cateringPhone: "",
  itPhone: ""
});

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    console.warn(`Não foi possível ler ${key}:`, error);
    return fallback;
  }
}

function saveBookings() {
  localStorage.setItem(STORAGE_KEYS.bookings, JSON.stringify(bookings));
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(dateString) {
  if (!dateString) return "—";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
}

function formatDateLong(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}

function getRoom(roomId) {
  return rooms.find((room) => room.id === roomId);
}

function bookingStartDate(booking) {
  return new Date(`${booking.date}T${booking.startTime}:00`);
}

function generateConfirmationCode(date) {
  const datePart = date.replaceAll("-", "");
  const randomPart = Math.floor(100 + Math.random() * 900);
  return `RF-${datePart}-${randomPart}`;
}

function checkedValues(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(
    (input) => input.value
  );
}

function clearCheckedValues(name) {
  document.querySelectorAll(`input[name="${name}"]`).forEach((input) => {
    input.checked = false;
  });
}

function setInitialFormState() {
  elements.room.innerHTML = rooms
    .map(
      (room) =>
        `<option value="${room.id}">${room.name} — até ${room.capacity} pessoas</option>`
    )
    .join("");

  elements.date.min = localDateString();
  elements.date.value = localDateString();
  elements.startTime.value = "09:00";
  elements.endTime.value = "10:00";
  elements.roomCount.textContent = String(rooms.length);
  updateCapacityFeedback();
}

function updateCapacityFeedback() {
  const room = getRoom(elements.room.value);
  const participants = Number(elements.participants.value || 0);

  if (!room) {
    elements.capacityFeedback.textContent = "Selecione uma sala.";
    elements.capacityFeedback.className = "capacity-feedback";
    return;
  }

  if (participants > room.capacity) {
    elements.capacityFeedback.textContent = `${room.name} comporta até ${room.capacity} pessoas. Selecione outra sala ou reduza os participantes.`;
    elements.capacityFeedback.className = "capacity-feedback error";
    return;
  }

  elements.capacityFeedback.textContent = `Capacidade disponível: ${room.capacity} pessoas. Restam ${Math.max(
    room.capacity - participants,
    0
  )} lugares.`;
  elements.capacityFeedback.className = "capacity-feedback ok";
}

function hasTimeConflict(candidate) {
  return bookings.some((booking) => {
    if (booking.status === "cancelled") return false;
    if (booking.roomId !== candidate.roomId || booking.date !== candidate.date) return false;

    return (
      candidate.startTime < booking.endTime &&
      candidate.endTime > booking.startTime
    );
  });
}

function validateBooking(candidate) {
  const phone = onlyDigits(candidate.userPhone);
  const room = getRoom(candidate.roomId);
  const now = new Date();
  const start = new Date(`${candidate.date}T${candidate.startTime}:00`);

  if (!candidate.title || !candidate.organizer) {
    return "Informe o título e o responsável pela reunião.";
  }

  if (phone.length < 10 || phone.length > 15) {
    return "Informe um WhatsApp válido com país, DDD e número, usando somente dígitos.";
  }

  if (!candidate.date || !candidate.startTime || !candidate.endTime || !room) {
    return "Preencha data, sala e horários.";
  }

  if (candidate.endTime <= candidate.startTime) {
    return "O horário final precisa ser posterior ao horário inicial.";
  }

  if (start.getTime() < now.getTime()) {
    return "Não é possível criar uma reunião em uma data ou horário que já passou.";
  }

  if (!Number.isInteger(candidate.participants) || candidate.participants < 1) {
    return "Informe uma quantidade válida de participantes.";
  }

  if (candidate.participants > room.capacity) {
    return `${room.name} comporta no máximo ${room.capacity} pessoas.`;
  }

  if (candidate.cateringSupport && candidate.cateringItems.length === 0) {
    return "Selecione pelo menos um item para o atendimento da copa.";
  }

  if (!candidate.whatsappConsent) {
    return "Autorize as notificações pelo WhatsApp para confirmar a reserva.";
  }

  if (hasTimeConflict(candidate)) {
    return "Essa sala já possui uma reserva que conflita com o horário informado.";
  }

  return "";
}

function createBookingFromForm() {
  const videoConference = elements.videoConference.checked;
  const itSupport = elements.itSupport.checked;
  const cateringSupport = elements.cateringSupport.checked;

  return {
    id: `booking-${Date.now()}`,
    confirmationCode: generateConfirmationCode(elements.date.value),
    title: elements.title.value.trim(),
    organizer: elements.organizer.value.trim(),
    userPhone: onlyDigits(elements.userPhone.value),
    date: elements.date.value,
    roomId: elements.room.value,
    startTime: elements.startTime.value,
    endTime: elements.endTime.value,
    participants: Number(elements.participants.value),
    videoConference,
    videoPlatform: videoConference ? elements.videoPlatform.value : "",
    meetingLink: videoConference ? elements.meetingLink.value.trim() : "",
    equipment: videoConference ? checkedValues("equipment") : [],
    itSupport,
    itStatus: itSupport ? "requested" : "not_requested",
    cateringSupport,
    cateringItems: cateringSupport ? checkedValues("catering") : [],
    cateringNotes: cateringSupport ? elements.cateringNotes.value.trim() : "",
    cateringStatus: cateringSupport ? "requested" : "not_requested",
    notes: elements.notes.value.trim(),
    whatsappConsent: elements.whatsappConsent.checked,
    status: "confirmed",
    createdAt: new Date().toISOString()
  };
}

function buildUserMessage(booking) {
  const room = getRoom(booking.roomId);
  const supportLines = [];

  if (booking.cateringSupport) supportLines.push("☕ Apoio da copa: solicitado");
  if (booking.itSupport) supportLines.push("💻 Apoio da informática: solicitado");
  if (!supportLines.length) supportLines.push("Serviços adicionais: não solicitados");

  return [
    "✅ *Sala confirmada — RoomFlow*",
    "",
    `Olá, ${booking.organizer}! Sua reserva foi registrada.`,
    "",
    `*Reunião:* ${booking.title}`,
    `*Sala:* ${room.name}`,
    `*Data:* ${formatDate(booking.date)}`,
    `*Horário:* ${booking.startTime} às ${booking.endTime}`,
    `*Participantes:* ${booking.participants}`,
    `*Videoconferência:* ${booking.videoConference ? `Sim — ${booking.videoPlatform}` : "Não"}`,
    "",
    ...supportLines,
    "",
    `*Código da reserva:* ${booking.confirmationCode}`
  ].join("\n");
}

function buildCateringMessage(booking) {
  const room = getRoom(booking.roomId);
  return [
    "☕ *Nova solicitação para a copa*",
    "",
    `*Reunião:* ${booking.title}`,
    `*Responsável:* ${booking.organizer}`,
    `*Sala:* ${room.name}`,
    `*Data:* ${formatDate(booking.date)}`,
    `*Horário:* ${booking.startTime} às ${booking.endTime}`,
    `*Participantes:* ${booking.participants}`,
    `*Itens:* ${booking.cateringItems.join(", ")}`,
    `*Observação:* ${booking.cateringNotes || "Nenhuma"}`,
    "",
    `*Código:* ${booking.confirmationCode}`,
    "Por favor, confirme o atendimento com o responsável."
  ].join("\n");
}

function buildItMessage(booking) {
  const room = getRoom(booking.roomId);
  return [
    "💻 *Novo apoio de informática*",
    "",
    `*Reunião:* ${booking.title}`,
    `*Responsável:* ${booking.organizer}`,
    `*Sala:* ${room.name}`,
    `*Data:* ${formatDate(booking.date)}`,
    `*Horário:* ${booking.startTime} às ${booking.endTime}`,
    `*Videoconferência:* ${booking.videoConference ? "Sim" : "Não"}`,
    `*Plataforma:* ${booking.videoPlatform || "Não informada"}`,
    `*Equipamentos:* ${booking.equipment.length ? booking.equipment.join(", ") : "Nenhum informado"}`,
    `*Link:* ${booking.meetingLink || "Não informado"}`,
    `*Observações:* ${booking.notes || "Nenhuma"}`,
    "",
    `*Código:* ${booking.confirmationCode}`,
    "Por favor, confirme o atendimento com o responsável."
  ].join("\n");
}

function whatsappUrl(phone, message) {
  const sanitizedPhone = onlyDigits(phone);
  if (!sanitizedPhone) return "";
  return `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(message)}`;
}

function renderRoomList() {
  const today = localDateString();
  const nowTime = new Date().toTimeString().slice(0, 5);

  elements.roomList.innerHTML = rooms
    .map((room) => {
      const activeBooking = bookings.find(
        (booking) =>
          booking.status !== "cancelled" &&
          booking.roomId === room.id &&
          booking.date === today &&
          booking.startTime <= nowTime &&
          booking.endTime > nowTime
      );

      return `
        <div class="room-item">
          <span class="room-symbol">${room.id === "auditorio" ? "🎤" : "🚪"}</span>
          <div>
            <strong>${escapeHtml(room.name)}</strong>
            <small>${escapeHtml(room.location)} · até ${room.capacity} pessoas</small>
          </div>
          <span class="status-pill ${activeBooking ? "pending" : "success"}">
            ${activeBooking ? `Ocupada até ${activeBooking.endTime}` : "Disponível"}
          </span>
        </div>
      `;
    })
    .join("");
}

function renderDashboard() {
  const today = localDateString();
  const activeBookings = bookings.filter((booking) => booking.status !== "cancelled");

  elements.todayCount.textContent = String(
    activeBookings.filter((booking) => booking.date === today).length
  );
  elements.cateringCount.textContent = String(
    activeBookings.filter((booking) => booking.cateringSupport).length
  );
  elements.itCount.textContent = String(
    activeBookings.filter((booking) => booking.itSupport).length
  );

  const now = new Date();
  const nextBooking = activeBookings
    .filter((booking) => bookingStartDate(booking) >= now)
    .sort((a, b) => bookingStartDate(a) - bookingStartDate(b))[0];

  if (!nextBooking) {
    elements.nextMeeting.innerHTML = `
      <span>🗓️</span>
      <h3>Nenhuma reunião futura</h3>
      <p>Crie uma reserva para visualizar os detalhes aqui.</p>
    `;
    elements.nextMeeting.className = "empty-state";
  } else {
    const room = getRoom(nextBooking.roomId);
    elements.nextMeeting.className = "next-meeting-content";
    elements.nextMeeting.innerHTML = `
      <span class="date-chip">${escapeHtml(formatDateLong(nextBooking.date))}</span>
      <h3>${escapeHtml(nextBooking.title)}</h3>
      <p>
        <strong>${nextBooking.startTime} às ${nextBooking.endTime}</strong><br>
        ${escapeHtml(room.name)} · ${nextBooking.participants} participantes<br>
        Responsável: ${escapeHtml(nextBooking.organizer)}
      </p>
    `;
  }

  renderRoomList();
}

function supportTags(booking) {
  const tags = ["Sala confirmada"];
  if (booking.videoConference) tags.push(`Vídeo: ${booking.videoPlatform}`);
  if (booking.cateringSupport) tags.push("Copa solicitada");
  if (booking.itSupport) tags.push("TI solicitada");
  return tags;
}

function renderBookings() {
  const orderedBookings = [...bookings].sort(
    (a, b) => bookingStartDate(a) - bookingStartDate(b)
  );

  if (!orderedBookings.length) {
    elements.bookingList.innerHTML = `
      <div class="empty-bookings">
        <strong>Nenhuma reserva cadastrada.</strong>
        <p>Use o formulário acima para testar o fluxo completo.</p>
      </div>
    `;
    return;
  }

  elements.bookingList.innerHTML = orderedBookings
    .map((booking) => {
      const room = getRoom(booking.roomId);
      const cancelled = booking.status === "cancelled";
      return `
        <article class="booking-card">
          <div class="booking-card-header">
            <div>
              <h3>${escapeHtml(booking.title)}</h3>
              <span class="booking-code">${escapeHtml(booking.confirmationCode)}</span>
            </div>
            <span class="status-pill ${cancelled ? "neutral" : "success"}">
              ${cancelled ? "Cancelada" : "Confirmada"}
            </span>
          </div>
          <div class="booking-meta">
            <div class="meta-item"><small>Data</small><strong>${formatDate(booking.date)}</strong></div>
            <div class="meta-item"><small>Horário</small><strong>${booking.startTime}–${booking.endTime}</strong></div>
            <div class="meta-item"><small>Sala</small><strong>${escapeHtml(room.name)}</strong></div>
            <div class="meta-item"><small>Participantes</small><strong>${booking.participants}</strong></div>
          </div>
          <div class="support-tags">
            ${supportTags(booking)
              .map((tag) => `<span class="support-tag">${escapeHtml(tag)}</span>`)
              .join("")}
          </div>
          <div class="booking-card-footer">
            <p>Responsável: ${escapeHtml(booking.organizer)}</p>
            <div class="card-actions">
              ${
                cancelled
                  ? ""
                  : `<button class="card-action-button" data-action="notify" data-id="${booking.id}" type="button">WhatsApp</button>
                     <button class="card-action-button danger" data-action="cancel" data-id="${booking.id}" type="button">Cancelar</button>`
              }
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderAll() {
  renderDashboard();
  renderBookings();
}

function confirmationItem(label, value) {
  return `<div class="confirmation-item"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`;
}

function whatsappButton(label, phone, message, missingPhoneText) {
  const url = whatsappUrl(phone, message);
  if (!url) {
    return `<span class="whatsapp-button disabled">${escapeHtml(missingPhoneText)}</span>`;
  }
  return `<a class="whatsapp-button" href="${url}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
}

function showConfirmation(booking) {
  const room = getRoom(booking.roomId);

  elements.confirmationDetails.innerHTML = [
    confirmationItem("Código", booking.confirmationCode),
    confirmationItem("Sala", room.name),
    confirmationItem("Data", formatDate(booking.date)),
    confirmationItem("Horário", `${booking.startTime} às ${booking.endTime}`),
    confirmationItem("Participantes", String(booking.participants)),
    confirmationItem("Responsável", booking.organizer)
  ].join("");

  const buttons = [
    whatsappButton(
      "Enviar confirmação ao usuário",
      booking.userPhone,
      buildUserMessage(booking),
      "WhatsApp do usuário não informado"
    )
  ];

  if (booking.cateringSupport) {
    buttons.push(
      whatsappButton(
        "Enviar solicitação para a copa",
        settings.cateringPhone,
        buildCateringMessage(booking),
        "Cadastre o WhatsApp da copa nas configurações"
      )
    );
  }

  if (booking.itSupport) {
    buttons.push(
      whatsappButton(
        "Enviar solicitação para a informática",
        settings.itPhone,
        buildItMessage(booking),
        "Cadastre o WhatsApp da informática nas configurações"
      )
    );
  }

  elements.whatsappActions.innerHTML = buttons.join("");
  elements.confirmationModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeConfirmation() {
  elements.confirmationModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function resetBookingForm() {
  elements.bookingForm.reset();
  elements.date.value = localDateString();
  elements.startTime.value = "09:00";
  elements.endTime.value = "10:00";
  elements.participants.value = "1";
  elements.videoOptions.classList.add("hidden");
  elements.cateringOptions.classList.add("hidden");
  clearCheckedValues("equipment");
  clearCheckedValues("catering");
  elements.formMessage.textContent = "";
  updateCapacityFeedback();
}

function handleBookingSubmit(event) {
  event.preventDefault();
  elements.formMessage.textContent = "";

  const candidate = createBookingFromForm();
  const validationError = validateBooking(candidate);

  if (validationError) {
    elements.formMessage.textContent = validationError;
    return;
  }

  bookings.push(candidate);
  saveBookings();
  renderAll();
  showConfirmation(candidate);
  resetBookingForm();
}

function handleBookingListClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const booking = bookings.find((item) => item.id === button.dataset.id);
  if (!booking) return;

  if (button.dataset.action === "notify") {
    showConfirmation(booking);
    return;
  }

  if (button.dataset.action === "cancel") {
    const confirmed = window.confirm(
      `Deseja cancelar a reserva ${booking.confirmationCode}?`
    );
    if (!confirmed) return;

    booking.status = "cancelled";
    saveBookings();
    renderAll();
  }
}

function handleSettingsSubmit(event) {
  event.preventDefault();

  const cateringPhone = onlyDigits(elements.cateringPhone.value);
  const itPhone = onlyDigits(elements.itPhone.value);

  if ((cateringPhone && cateringPhone.length < 10) || (itPhone && itPhone.length < 10)) {
    elements.settingsMessage.style.color = "var(--danger)";
    elements.settingsMessage.textContent = "Use país, DDD e número. Exemplo: 5561999999999.";
    return;
  }

  settings = { cateringPhone, itPhone };
  saveSettings();
  elements.settingsMessage.style.color = "var(--success)";
  elements.settingsMessage.textContent = "Números salvos neste navegador.";
}

function loadSettingsIntoForm() {
  elements.cateringPhone.value = settings.cateringPhone || "";
  elements.itPhone.value = settings.itPhone || "";
}

function clearDemonstration() {
  if (!bookings.length) return;
  const confirmed = window.confirm("Deseja remover todas as reservas desta demonstração?");
  if (!confirmed) return;

  bookings = [];
  saveBookings();
  renderAll();
}

function setupEvents() {
  elements.bookingForm.addEventListener("submit", handleBookingSubmit);
  elements.bookingForm.addEventListener("reset", () => {
    window.setTimeout(resetBookingForm, 0);
  });
  elements.settingsForm.addEventListener("submit", handleSettingsSubmit);
  elements.bookingList.addEventListener("click", handleBookingListClick);
  elements.room.addEventListener("change", updateCapacityFeedback);
  elements.participants.addEventListener("input", updateCapacityFeedback);

  elements.videoConference.addEventListener("change", () => {
    const active = elements.videoConference.checked;
    elements.videoOptions.classList.toggle("hidden", !active);
    if (active) elements.itSupport.checked = true;
  });

  elements.cateringSupport.addEventListener("change", () => {
    elements.cateringOptions.classList.toggle(
      "hidden",
      !elements.cateringSupport.checked
    );
  });

  elements.closeModalButton.addEventListener("click", closeConfirmation);
  elements.finishModalButton.addEventListener("click", closeConfirmation);
  elements.confirmationModal.addEventListener("click", (event) => {
    if (event.target === elements.confirmationModal) closeConfirmation();
  });

  elements.openBookingButton.addEventListener("click", () => {
    document.querySelector("#nova-reserva").scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => elements.title.focus(), 450);
  });

  elements.clearBookingsButton.addEventListener("click", clearDemonstration);

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeConfirmation();
  });
}

function initialize() {
  setInitialFormState();
  loadSettingsIntoForm();
  setupEvents();
  renderAll();
}

initialize();
