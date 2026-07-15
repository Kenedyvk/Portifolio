"use strict";

const rooms = [
  { id: "principal", name: "Sala Principal", location: "1º andar", capacity: 12 },
  { id: "executiva", name: "Sala Executiva", location: "2º andar", capacity: 6 },
  { id: "auditorio", name: "Auditório", location: "Térreo", capacity: 50 }
];

const STORAGE = {
  bookings: "roomflow_bookings_v1",
  settings: "roomflow_settings_v1"
};

const $ = (selector) => document.querySelector(selector);
const elements = {
  bookingForm: $("#bookingForm"),
  settingsForm: $("#settingsForm"),
  title: $("#title"),
  organizer: $("#organizer"),
  userPhone: $("#userPhone"),
  date: $("#date"),
  room: $("#room"),
  startTime: $("#startTime"),
  endTime: $("#endTime"),
  participants: $("#participants"),
  capacityFeedback: $("#capacityFeedback"),
  videoConference: $("#videoConference"),
  videoOptions: $("#videoOptions"),
  videoPlatform: $("#videoPlatform"),
  meetingLink: $("#meetingLink"),
  itSupport: $("#itSupport"),
  cateringSupport: $("#cateringSupport"),
  cateringOptions: $("#cateringOptions"),
  cateringNotes: $("#cateringNotes"),
  notes: $("#notes"),
  whatsappConsent: $("#whatsappConsent"),
  formMessage: $("#formMessage"),
  roomList: $("#roomList"),
  bookingList: $("#bookingList"),
  nextMeeting: $("#nextMeeting"),
  todayCount: $("#todayCount"),
  roomCount: $("#roomCount"),
  cateringCount: $("#cateringCount"),
  itCount: $("#itCount"),
  cateringPhone: $("#cateringPhone"),
  itPhone: $("#itPhone"),
  settingsMessage: $("#settingsMessage"),
  confirmationModal: $("#confirmationModal"),
  confirmationDetails: $("#confirmationDetails"),
  whatsappActions: $("#whatsappActions"),
  closeModalButton: $("#closeModalButton"),
  finishModalButton: $("#finishModalButton"),
  openBookingButton: $("#openBookingButton"),
  clearBookingsButton: $("#clearBookingsButton")
};

let bookings = readStorage(STORAGE.bookings, []);
let settings = readStorage(STORAGE.settings, { cateringPhone: "", itPhone: "" });

function readStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    console.warn(`Falha ao ler ${key}:`, error);
    return fallback;
  }
}

function saveBookings() {
  localStorage.setItem(STORAGE.bookings, JSON.stringify(bookings));
}

function saveSettings() {
  localStorage.setItem(STORAGE.settings, JSON.stringify(settings));
}

function digits(value) {
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

function localDate(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(value) {
  if (!value) return "—";
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

function formatLongDate(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(new Date(`${value}T12:00:00`));
}

function getRoom(id) {
  return rooms.find((room) => room.id === id);
}

function getChecked(name) {
  return [...document.querySelectorAll(`input[name="${name}"]:checked`)].map(
    (input) => input.value
  );
}

function getBookingStart(booking) {
  return new Date(`${booking.date}T${booking.startTime}:00`);
}

function confirmationCode(date) {
  const random = Math.floor(100 + Math.random() * 900);
  return `RF-${date.replaceAll("-", "")}-${random}`;
}

function populateRooms() {
  elements.room.innerHTML = rooms
    .map(
      (room) =>
        `<option value="${room.id}">${room.name} — até ${room.capacity} pessoas</option>`
    )
    .join("");
  elements.roomCount.textContent = String(rooms.length);
}

function applyFormDefaults(resetNativeForm = false) {
  if (resetNativeForm) elements.bookingForm.reset();
  elements.date.min = localDate();
  elements.date.value = localDate();
  elements.startTime.value = "09:00";
  elements.endTime.value = "10:00";
  elements.participants.value = "1";
  elements.videoOptions.classList.add("hidden");
  elements.cateringOptions.classList.add("hidden");
  elements.formMessage.textContent = "";
  updateCapacity();
}

function updateCapacity() {
  const room = getRoom(elements.room.value);
  const participants = Number(elements.participants.value || 0);

  if (!room) {
    elements.capacityFeedback.textContent = "Selecione uma sala.";
    elements.capacityFeedback.className = "capacity-feedback";
    return;
  }

  if (participants > room.capacity) {
    elements.capacityFeedback.textContent = `${room.name} comporta até ${room.capacity} pessoas.`;
    elements.capacityFeedback.className = "capacity-feedback error";
    return;
  }

  const remaining = Math.max(room.capacity - participants, 0);
  elements.capacityFeedback.textContent = `Capacidade: ${room.capacity} pessoas. Restam ${remaining} lugares.`;
  elements.capacityFeedback.className = "capacity-feedback ok";
}

function buildBooking() {
  const videoConference = elements.videoConference.checked;
  const cateringSupport = elements.cateringSupport.checked;

  return {
    id: `booking-${Date.now()}`,
    confirmationCode: confirmationCode(elements.date.value),
    title: elements.title.value.trim(),
    organizer: elements.organizer.value.trim(),
    userPhone: digits(elements.userPhone.value),
    date: elements.date.value,
    roomId: elements.room.value,
    startTime: elements.startTime.value,
    endTime: elements.endTime.value,
    participants: Number(elements.participants.value),
    videoConference,
    videoPlatform: videoConference ? elements.videoPlatform.value : "",
    meetingLink: videoConference ? elements.meetingLink.value.trim() : "",
    equipment: videoConference ? getChecked("equipment") : [],
    itSupport: elements.itSupport.checked,
    cateringSupport,
    cateringItems: cateringSupport ? getChecked("catering") : [],
    cateringNotes: cateringSupport ? elements.cateringNotes.value.trim() : "",
    notes: elements.notes.value.trim(),
    whatsappConsent: elements.whatsappConsent.checked,
    status: "confirmed",
    createdAt: new Date().toISOString()
  };
}

function hasConflict(candidate) {
  return bookings.some((booking) => {
    const sameRoomAndDate =
      booking.status !== "cancelled" &&
      booking.roomId === candidate.roomId &&
      booking.date === candidate.date;

    return (
      sameRoomAndDate &&
      candidate.startTime < booking.endTime &&
      candidate.endTime > booking.startTime
    );
  });
}

function validateBooking(booking) {
  const room = getRoom(booking.roomId);
  const start = new Date(`${booking.date}T${booking.startTime}:00`);

  if (!booking.title || !booking.organizer) {
    return "Informe o título e o responsável pela reunião.";
  }
  if (booking.userPhone.length < 10 || booking.userPhone.length > 15) {
    return "Informe um WhatsApp válido com país, DDD e número.";
  }
  if (!booking.date || !booking.startTime || !booking.endTime || !room) {
    return "Preencha a data, a sala e os horários.";
  }
  if (booking.endTime <= booking.startTime) {
    return "O horário final precisa ser posterior ao inicial.";
  }
  if (start.getTime() < Date.now()) {
    return "Não é possível agendar uma reunião em um horário que já passou.";
  }
  if (!Number.isInteger(booking.participants) || booking.participants < 1) {
    return "Informe uma quantidade válida de participantes.";
  }
  if (booking.participants > room.capacity) {
    return `${room.name} comporta no máximo ${room.capacity} pessoas.`;
  }
  if (booking.cateringSupport && booking.cateringItems.length === 0) {
    return "Selecione pelo menos um item para a copa.";
  }
  if (!booking.whatsappConsent) {
    return "Autorize as notificações pelo WhatsApp.";
  }
  if (hasConflict(booking)) {
    return "A sala já possui uma reserva que conflita com esse horário.";
  }
  return "";
}

function userMessage(booking) {
  const room = getRoom(booking.roomId);
  const supports = [];
  if (booking.cateringSupport) supports.push("☕ Apoio da copa: solicitado");
  if (booking.itSupport) supports.push("💻 Apoio da informática: solicitado");
  if (!supports.length) supports.push("Serviços adicionais: não solicitados");

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
    ...supports,
    "",
    `*Código:* ${booking.confirmationCode}`
  ].join("\n");
}

function cateringMessage(booking) {
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

function itMessage(booking) {
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
    `*Equipamentos:* ${booking.equipment.length ? booking.equipment.join(", ") : "Nenhum"}`,
    `*Link:* ${booking.meetingLink || "Não informado"}`,
    `*Observações:* ${booking.notes || "Nenhuma"}`,
    "",
    `*Código:* ${booking.confirmationCode}`,
    "Por favor, confirme o atendimento com o responsável."
  ].join("\n");
}

function whatsappLink(phone, message) {
  const number = digits(phone);
  return number ? `https://wa.me/${number}?text=${encodeURIComponent(message)}` : "";
}

function whatsappButton(label, phone, message, emptyLabel) {
  const link = whatsappLink(phone, message);
  return link
    ? `<a class="whatsapp-button" href="${link}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`
    : `<span class="whatsapp-button disabled">${escapeHtml(emptyLabel)}</span>`;
}

function showConfirmation(booking) {
  const room = getRoom(booking.roomId);
  const item = (label, value) =>
    `<div class="confirmation-item"><small>${escapeHtml(label)}</small><strong>${escapeHtml(value)}</strong></div>`;

  elements.confirmationDetails.innerHTML = [
    item("Código", booking.confirmationCode),
    item("Sala", room.name),
    item("Data", formatDate(booking.date)),
    item("Horário", `${booking.startTime} às ${booking.endTime}`),
    item("Participantes", booking.participants),
    item("Responsável", booking.organizer)
  ].join("");

  const actions = [
    whatsappButton(
      "Enviar confirmação ao usuário",
      booking.userPhone,
      userMessage(booking),
      "WhatsApp do usuário não informado"
    )
  ];

  if (booking.cateringSupport) {
    actions.push(
      whatsappButton(
        "Enviar solicitação para a copa",
        settings.cateringPhone,
        cateringMessage(booking),
        "Cadastre o WhatsApp da copa"
      )
    );
  }

  if (booking.itSupport) {
    actions.push(
      whatsappButton(
        "Enviar solicitação para a informática",
        settings.itPhone,
        itMessage(booking),
        "Cadastre o WhatsApp da informática"
      )
    );
  }

  elements.whatsappActions.innerHTML = actions.join("");
  elements.confirmationModal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeConfirmation() {
  elements.confirmationModal.classList.add("hidden");
  document.body.style.overflow = "";
}

function renderRooms() {
  const today = localDate();
  const currentTime = new Date().toTimeString().slice(0, 5);

  elements.roomList.innerHTML = rooms
    .map((room) => {
      const active = bookings.find(
        (booking) =>
          booking.status !== "cancelled" &&
          booking.roomId === room.id &&
          booking.date === today &&
          booking.startTime <= currentTime &&
          booking.endTime > currentTime
      );

      return `
        <div class="room-item">
          <span class="room-symbol">${room.id === "auditorio" ? "🎤" : "🚪"}</span>
          <div>
            <strong>${escapeHtml(room.name)}</strong>
            <small>${escapeHtml(room.location)} · até ${room.capacity} pessoas</small>
          </div>
          <span class="status-pill ${active ? "pending" : "success"}">
            ${active ? `Ocupada até ${active.endTime}` : "Disponível"}
          </span>
        </div>`;
    })
    .join("");
}

function renderDashboard() {
  const active = bookings.filter((booking) => booking.status !== "cancelled");
  elements.todayCount.textContent = String(
    active.filter((booking) => booking.date === localDate()).length
  );
  elements.cateringCount.textContent = String(
    active.filter((booking) => booking.cateringSupport).length
  );
  elements.itCount.textContent = String(
    active.filter((booking) => booking.itSupport).length
  );

  const next = active
    .filter((booking) => getBookingStart(booking) >= new Date())
    .sort((a, b) => getBookingStart(a) - getBookingStart(b))[0];

  if (!next) {
    elements.nextMeeting.className = "empty-state";
    elements.nextMeeting.innerHTML =
      "<span>🗓️</span><h3>Nenhuma reunião futura</h3><p>Crie uma reserva para visualizar os detalhes aqui.</p>";
  } else {
    const room = getRoom(next.roomId);
    elements.nextMeeting.className = "next-meeting-content";
    elements.nextMeeting.innerHTML = `
      <span class="date-chip">${escapeHtml(formatLongDate(next.date))}</span>
      <h3>${escapeHtml(next.title)}</h3>
      <p><strong>${next.startTime} às ${next.endTime}</strong><br>
      ${escapeHtml(room.name)} · ${next.participants} participantes<br>
      Responsável: ${escapeHtml(next.organizer)}</p>`;
  }

  renderRooms();
}

function bookingTags(booking) {
  const tags = ["Sala confirmada"];
  if (booking.videoConference) tags.push(`Vídeo: ${booking.videoPlatform}`);
  if (booking.cateringSupport) tags.push("Copa solicitada");
  if (booking.itSupport) tags.push("TI solicitada");
  return tags;
}

function renderBookings() {
  const ordered = [...bookings].sort((a, b) => getBookingStart(a) - getBookingStart(b));

  if (!ordered.length) {
    elements.bookingList.innerHTML =
      '<div class="empty-bookings"><strong>Nenhuma reserva cadastrada.</strong><p>Use o formulário acima para testar o fluxo completo.</p></div>';
    return;
  }

  elements.bookingList.innerHTML = ordered
    .map((booking) => {
      const room = getRoom(booking.roomId);
      const cancelled = booking.status === "cancelled";
      return `
        <article class="booking-card">
          <div class="booking-card-header">
            <div><h3>${escapeHtml(booking.title)}</h3><span class="booking-code">${escapeHtml(booking.confirmationCode)}</span></div>
            <span class="status-pill ${cancelled ? "neutral" : "success"}">${cancelled ? "Cancelada" : "Confirmada"}</span>
          </div>
          <div class="booking-meta">
            <div class="meta-item"><small>Data</small><strong>${formatDate(booking.date)}</strong></div>
            <div class="meta-item"><small>Horário</small><strong>${booking.startTime}–${booking.endTime}</strong></div>
            <div class="meta-item"><small>Sala</small><strong>${escapeHtml(room.name)}</strong></div>
            <div class="meta-item"><small>Participantes</small><strong>${booking.participants}</strong></div>
          </div>
          <div class="support-tags">${bookingTags(booking)
            .map((tag) => `<span class="support-tag">${escapeHtml(tag)}</span>`)
            .join("")}</div>
          <div class="booking-card-footer">
            <p>Responsável: ${escapeHtml(booking.organizer)}</p>
            <div class="card-actions">
              ${cancelled ? "" : `<button class="card-action-button" data-action="notify" data-id="${booking.id}" type="button">WhatsApp</button><button class="card-action-button danger" data-action="cancel" data-id="${booking.id}" type="button">Cancelar</button>`}
            </div>
          </div>
        </article>`;
    })
    .join("");
}

function renderAll() {
  renderDashboard();
  renderBookings();
}

function submitBooking(event) {
  event.preventDefault();
  elements.formMessage.textContent = "";

  const booking = buildBooking();
  const error = validateBooking(booking);
  if (error) {
    elements.formMessage.textContent = error;
    return;
  }

  bookings.push(booking);
  saveBookings();
  renderAll();
  showConfirmation(booking);
  applyFormDefaults(true);
}

function handleBookingAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  const booking = bookings.find((item) => item.id === button.dataset.id);
  if (!booking) return;

  if (button.dataset.action === "notify") {
    showConfirmation(booking);
    return;
  }

  if (button.dataset.action === "cancel" && window.confirm(`Cancelar ${booking.confirmationCode}?`)) {
    booking.status = "cancelled";
    saveBookings();
    renderAll();
  }
}

function submitSettings(event) {
  event.preventDefault();
  const cateringPhone = digits(elements.cateringPhone.value);
  const itPhone = digits(elements.itPhone.value);

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

function clearDemo() {
  if (bookings.length && window.confirm("Remover todas as reservas da demonstração?")) {
    bookings = [];
    saveBookings();
    renderAll();
  }
}

function setupEvents() {
  elements.bookingForm.addEventListener("submit", submitBooking);
  elements.bookingForm.addEventListener("reset", () => {
    window.setTimeout(() => applyFormDefaults(false), 0);
  });
  elements.settingsForm.addEventListener("submit", submitSettings);
  elements.bookingList.addEventListener("click", handleBookingAction);
  elements.room.addEventListener("change", updateCapacity);
  elements.participants.addEventListener("input", updateCapacity);

  elements.videoConference.addEventListener("change", () => {
    const enabled = elements.videoConference.checked;
    elements.videoOptions.classList.toggle("hidden", !enabled);
    if (enabled) elements.itSupport.checked = true;
  });

  elements.cateringSupport.addEventListener("change", () => {
    elements.cateringOptions.classList.toggle("hidden", !elements.cateringSupport.checked);
  });

  elements.closeModalButton.addEventListener("click", closeConfirmation);
  elements.finishModalButton.addEventListener("click", closeConfirmation);
  elements.confirmationModal.addEventListener("click", (event) => {
    if (event.target === elements.confirmationModal) closeConfirmation();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeConfirmation();
  });

  elements.openBookingButton.addEventListener("click", () => {
    $("#nova-reserva").scrollIntoView({ behavior: "smooth" });
    window.setTimeout(() => elements.title.focus(), 450);
  });
  elements.clearBookingsButton.addEventListener("click", clearDemo);

  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      document.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("active"));
      link.classList.add("active");
    });
  });
}

function initialize() {
  populateRooms();
  applyFormDefaults(false);
  elements.cateringPhone.value = settings.cateringPhone || "";
  elements.itPhone.value = settings.itPhone || "";
  setupEvents();
  renderAll();
}

initialize();
