"use strict";

const rooms = [
  { id: "principal", name: "Sala Principal", location: "1º andar", capacity: 12 },
  { id: "executiva", name: "Sala Executiva", location: "2º andar", capacity: 6 },
  { id: "auditorio", name: "Auditório", location: "Térreo", capacity: 50 }
];
const KEYS = { bookings: "roomflow_bookings_email_v1", settings: "roomflow_email_settings_v1" };
const $ = (selector) => document.querySelector(selector);
const E = {
  form: $("#bookingForm"), settingsForm: $("#settingsForm"), title: $("#title"),
  organizer: $("#organizer"), userEmail: $("#userEmail"), date: $("#date"),
  room: $("#room"), start: $("#startTime"), end: $("#endTime"),
  participants: $("#participants"), capacity: $("#capacityFeedback"),
  video: $("#videoConference"), videoOptions: $("#videoOptions"),
  platform: $("#videoPlatform"), meetingLink: $("#meetingLink"),
  itSupport: $("#itSupport"), cateringSupport: $("#cateringSupport"),
  cateringOptions: $("#cateringOptions"), cateringNotes: $("#cateringNotes"),
  notes: $("#notes"), consent: $("#emailConsent"), message: $("#formMessage"),
  roomList: $("#roomList"), bookingList: $("#bookingList"), nextMeeting: $("#nextMeeting"),
  todayCount: $("#todayCount"), roomCount: $("#roomCount"), cateringCount: $("#cateringCount"),
  itCount: $("#itCount"), cateringEmail: $("#cateringEmail"), itEmail: $("#itEmail"),
  provider: $("#emailProvider"), settingsMessage: $("#settingsMessage"),
  modal: $("#confirmationModal"), modalDetails: $("#confirmationDetails"),
  emailActions: $("#emailActions"), closeModal: $("#closeModalButton"),
  finishModal: $("#finishModalButton"), openBooking: $("#openBookingButton"),
  clearBookings: $("#clearBookingsButton"), calendarTitle: $("#calendarTitle"),
  calendarGrid: $("#calendarGrid"), previousMonth: $("#previousMonthButton"),
  nextMonth: $("#nextMonthButton"), todayButton: $("#todayButton")
};

const load = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};
let bookings = load(KEYS.bookings, []);
let settings = load(KEYS.settings, { cateringEmail: "", itEmail: "", provider: "gmail" });
let calendarCursor = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 12);

const save = () => localStorage.setItem(KEYS.bookings, JSON.stringify(bookings));
const saveSettings = () => localStorage.setItem(KEYS.settings, JSON.stringify(settings));
const pad = (value) => String(value).padStart(2, "0");
const dateKey = (date = new Date()) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
const displayDate = (value) => value ? value.split("-").reverse().join("/") : "—";
const roomById = (id) => rooms.find((room) => room.id === id);
const emailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
}[char]));
const checked = (name) => [...document.querySelectorAll(`input[name="${name}"]:checked`)].map((item) => item.value);
const bookingDate = (booking) => new Date(`${booking.date}T${booking.startTime}:00`);
const monthName = (date) => {
  const text = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(date);
  return text[0].toUpperCase() + text.slice(1);
};

function initializeForm() {
  E.room.innerHTML = rooms.map((room) => `<option value="${room.id}">${room.name} — até ${room.capacity} pessoas</option>`).join("");
  E.date.min = dateKey();
  E.date.value = dateKey();
  E.start.value = "09:00";
  E.end.value = "10:00";
  E.roomCount.textContent = rooms.length;
  E.cateringEmail.value = settings.cateringEmail || "";
  E.itEmail.value = settings.itEmail || "";
  E.provider.value = settings.provider || "gmail";
  updateCapacity();
}

function updateCapacity() {
  const room = roomById(E.room.value);
  const count = Number(E.participants.value || 0);
  if (!room) return;
  const exceeded = count > room.capacity;
  E.capacity.textContent = exceeded
    ? `${room.name} comporta no máximo ${room.capacity} pessoas.`
    : `Capacidade: ${room.capacity} pessoas. Restam ${Math.max(room.capacity - count, 0)} lugares.`;
  E.capacity.className = `capacity-feedback ${exceeded ? "error" : "ok"}`;
}

function conflict(candidate) {
  return bookings.some((item) => item.status !== "cancelled" && item.roomId === candidate.roomId &&
    item.date === candidate.date && candidate.startTime < item.endTime && candidate.endTime > item.startTime);
}

function formBooking() {
  const videoConference = E.video.checked;
  const cateringSupport = E.cateringSupport.checked;
  return {
    id: `booking-${Date.now()}`,
    confirmationCode: `RF-${E.date.value.replaceAll("-", "")}-${Math.floor(100 + Math.random() * 900)}`,
    title: E.title.value.trim(), organizer: E.organizer.value.trim(), userEmail: E.userEmail.value.trim(),
    date: E.date.value, roomId: E.room.value, startTime: E.start.value, endTime: E.end.value,
    participants: Number(E.participants.value), videoConference,
    videoPlatform: videoConference ? E.platform.value : "",
    meetingLink: videoConference ? E.meetingLink.value.trim() : "",
    equipment: videoConference ? checked("equipment") : [],
    itSupport: E.itSupport.checked, cateringSupport,
    cateringItems: cateringSupport ? checked("catering") : [],
    cateringNotes: cateringSupport ? E.cateringNotes.value.trim() : "",
    notes: E.notes.value.trim(), status: "confirmed", createdAt: new Date().toISOString()
  };
}

function validate(booking) {
  const room = roomById(booking.roomId);
  const start = new Date(`${booking.date}T${booking.startTime}:00`);
  if (!booking.title || !booking.organizer) return "Informe o título e o responsável.";
  if (!emailValid(booking.userEmail)) return "Informe um e-mail válido para o responsável.";
  if (!booking.date || !booking.startTime || !booking.endTime || !room) return "Preencha data, sala e horários.";
  if (booking.endTime <= booking.startTime) return "O horário final deve ser posterior ao inicial.";
  if (start < new Date()) return "Não é possível reservar uma data ou horário que já passou.";
  if (!Number.isInteger(booking.participants) || booking.participants < 1) return "Informe a quantidade de participantes.";
  if (booking.participants > room.capacity) return `${room.name} comporta no máximo ${room.capacity} pessoas.`;
  if (booking.cateringSupport && !booking.cateringItems.length) return "Selecione ao menos um item da copa.";
  if (!E.consent.checked) return "Autorize o envio das notificações por e-mail.";
  if (conflict(booking)) return "A sala já possui uma reserva que conflita com esse horário.";
  return "";
}

function emailMessages(booking) {
  const room = roomById(booking.roomId);
  const common = [
    `Reunião: ${booking.title}`, `Responsável: ${booking.organizer}`, `Sala: ${room.name}`,
    `Data: ${displayDate(booking.date)}`, `Horário: ${booking.startTime} às ${booking.endTime}`,
    `Participantes: ${booking.participants}`, `Código: ${booking.confirmationCode}`
  ];
  return {
    user: {
      subject: `Reserva confirmada - ${booking.confirmationCode}`,
      body: [`Olá, ${booking.organizer}!`, "", "Sua reserva de sala foi confirmada.", "", ...common,
        `Videoconferência: ${booking.videoConference ? `Sim - ${booking.videoPlatform}` : "Não"}`,
        `Apoio da copa: ${booking.cateringSupport ? "Solicitado" : "Não solicitado"}`,
        `Apoio da informática: ${booking.itSupport ? "Solicitado" : "Não solicitado"}`, "", "RoomFlow Corporate"].join("\n")
    },
    catering: {
      subject: `Solicitação da copa - ${booking.confirmationCode}`,
      body: ["Nova solicitação de apoio da copa", "", ...common,
        `Itens: ${booking.cateringItems.join(", ")}`, `Observação: ${booking.cateringNotes || "Nenhuma"}`,
        "", "Confirme o atendimento respondendo a este e-mail."].join("\n")
    },
    it: {
      subject: `Apoio de informática - ${booking.confirmationCode}`,
      body: ["Nova solicitação de apoio de informática", "", ...common,
        `Videoconferência: ${booking.videoConference ? "Sim" : "Não"}`,
        `Plataforma: ${booking.videoPlatform || "Não informada"}`,
        `Equipamentos: ${booking.equipment.length ? booking.equipment.join(", ") : "Nenhum"}`,
        `Link: ${booking.meetingLink || "Não informado"}`, `Observações: ${booking.notes || "Nenhuma"}`,
        "", "Confirme o atendimento respondendo a este e-mail."].join("\n")
    }
  };
}

function composeUrl(to, message) {
  if (!emailValid(to)) return "";
  if (settings.provider === "gmail") {
    return `https://mail.google.com/mail/?${new URLSearchParams({ view: "cm", fs: "1", to, su: message.subject, body: message.body })}`;
  }
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(message.subject)}&body=${encodeURIComponent(message.body)}`;
}

function emailButton(label, to, message, missing) {
  const url = composeUrl(to, message);
  return url
    ? `<a class="email-button" href="${url}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`
    : `<span class="email-button disabled">${escapeHtml(missing)}</span>`;
}

function showConfirmation(booking) {
  const room = roomById(booking.roomId);
  const item = (label, value) => `<div class="confirmation-item"><small>${label}</small><strong>${escapeHtml(value)}</strong></div>`;
  E.modalDetails.innerHTML = [item("Código", booking.confirmationCode), item("Sala", room.name),
    item("Data", displayDate(booking.date)), item("Horário", `${booking.startTime} às ${booking.endTime}`),
    item("Participantes", booking.participants), item("Responsável", booking.organizer)].join("");
  const messages = emailMessages(booking);
  const provider = settings.provider === "gmail" ? "Gmail" : "e-mail/Zimbra";
  const actions = [emailButton(`Abrir confirmação no ${provider}`, booking.userEmail, messages.user, "E-mail do responsável ausente")];
  if (booking.cateringSupport) actions.push(emailButton("Enviar solicitação para a copa", settings.cateringEmail, messages.catering, "Cadastre o e-mail da copa"));
  if (booking.itSupport) actions.push(emailButton("Enviar solicitação para a informática", settings.itEmail, messages.it, "Cadastre o e-mail da informática"));
  E.emailActions.innerHTML = actions.join("");
  E.modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeConfirmation() {
  E.modal.classList.add("hidden");
  document.body.style.overflow = "";
}

function renderDashboard() {
  const active = bookings.filter((item) => item.status !== "cancelled");
  E.todayCount.textContent = active.filter((item) => item.date === dateKey()).length;
  E.cateringCount.textContent = active.filter((item) => item.cateringSupport).length;
  E.itCount.textContent = active.filter((item) => item.itSupport).length;
  const nowTime = new Date().toTimeString().slice(0, 5);
  E.roomList.innerHTML = rooms.map((room) => {
    const busy = active.find((item) => item.roomId === room.id && item.date === dateKey() && item.startTime <= nowTime && item.endTime > nowTime);
    return `<div class="room-row"><div><strong>${room.name}</strong><small>${room.location} · até ${room.capacity} pessoas</small></div>
      <span class="status-pill ${busy ? "pending" : "success"}">${busy ? `Ocupada até ${busy.endTime}` : "Disponível"}</span></div>`;
  }).join("");
  const next = active.filter((item) => bookingDate(item) >= new Date()).sort((a, b) => bookingDate(a) - bookingDate(b))[0];
  if (!next) {
    E.nextMeeting.className = "empty-state";
    E.nextMeeting.innerHTML = "<span>🗓️</span><h3>Nenhuma reunião futura</h3><p>Crie uma reserva para visualizar os detalhes aqui.</p>";
  } else {
    const room = roomById(next.roomId);
    E.nextMeeting.className = "next-meeting-content";
    E.nextMeeting.innerHTML = `<span class="date-chip">${displayDate(next.date)}</span><h3>${escapeHtml(next.title)}</h3>
      <p><strong>${next.startTime} às ${next.endTime}</strong><br>${room.name} · ${next.participants} participantes<br>Responsável: ${escapeHtml(next.organizer)}</p>`;
  }
}

function renderBookings() {
  if (!bookings.length) {
    E.bookingList.innerHTML = '<div class="empty-bookings"><strong>Nenhuma reserva cadastrada.</strong><p>Use o formulário para testar o fluxo completo.</p></div>';
    return;
  }
  E.bookingList.innerHTML = [...bookings].sort((a, b) => bookingDate(a) - bookingDate(b)).map((booking) => {
    const room = roomById(booking.roomId);
    const cancelled = booking.status === "cancelled";
    const tags = ["Sala confirmada", booking.cateringSupport && "Copa solicitada", booking.itSupport && "TI solicitada"].filter(Boolean);
    return `<article class="booking-card"><div class="booking-card-header"><div><h3>${escapeHtml(booking.title)}</h3>
      <span class="booking-code">${booking.confirmationCode}</span></div><span class="status-pill ${cancelled ? "neutral" : "success"}">${cancelled ? "Cancelada" : "Confirmada"}</span></div>
      <div class="booking-meta"><div class="meta-item"><small>Data</small><strong>${displayDate(booking.date)}</strong></div>
      <div class="meta-item"><small>Horário</small><strong>${booking.startTime}–${booking.endTime}</strong></div>
      <div class="meta-item"><small>Sala</small><strong>${room.name}</strong></div><div class="meta-item"><small>Pessoas</small><strong>${booking.participants}</strong></div></div>
      <div class="support-tags">${tags.map((tag) => `<span class="support-tag">${tag}</span>`).join("")}</div>
      <div class="booking-card-footer"><p>Responsável: ${escapeHtml(booking.organizer)}</p><div class="card-actions">${cancelled ? "" :
        `<button class="card-action-button" data-action="email" data-id="${booking.id}" type="button">E-mail</button>
         <button class="card-action-button danger" data-action="cancel" data-id="${booking.id}" type="button">Cancelar</button>`}</div></div></article>`;
  }).join("");
}

function renderCalendar() {
  E.calendarTitle.textContent = monthName(calendarCursor);
  const year = calendarCursor.getFullYear(), month = calendarCursor.getMonth();
  const first = new Date(year, month, 1).getDay(), previousDays = new Date(year, month, 0).getDate();
  E.calendarGrid.innerHTML = Array.from({ length: 42 }, (_, index) => {
    let day, offset = 0, outside = false;
    if (index < first) { day = previousDays - first + index + 1; offset = -1; outside = true; }
    else if (index >= first + new Date(year, month + 1, 0).getDate()) { day = index - first - new Date(year, month + 1, 0).getDate() + 1; offset = 1; outside = true; }
    else day = index - first + 1;
    const value = dateKey(new Date(year, month + offset, day, 12));
    const items = bookings.filter((item) => item.status !== "cancelled" && item.date === value).sort((a, b) => a.startTime.localeCompare(b.startTime));
    const chips = items.slice(0, 3).map((item) => `<span class="calendar-booking ${item.cateringSupport || item.itSupport ? "with-support" : ""}">${item.startTime} ${escapeHtml(item.title)}</span>`).join("");
    return `<button class="calendar-day ${outside ? "outside-month" : ""} ${value === dateKey() ? "today" : ""}" data-date="${value}" type="button">
      <span class="day-number">${day}</span><span class="day-bookings">${chips}${items.length > 3 ? `<span class="calendar-more">+${items.length - 3}</span>` : ""}</span></button>`;
  }).join("");
}

function renderAll() { renderDashboard(); renderBookings(); renderCalendar(); }
function resetForm() {
  E.form.reset(); E.date.value = dateKey(); E.start.value = "09:00"; E.end.value = "10:00"; E.participants.value = 1;
  E.videoOptions.classList.add("hidden"); E.cateringOptions.classList.add("hidden"); E.message.textContent = ""; updateCapacity();
}

E.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const booking = formBooking(), error = validate(booking);
  E.message.textContent = error;
  if (error) return;
  bookings.push(booking); save(); calendarCursor = new Date(`${booking.date}T12:00:00`); calendarCursor.setDate(1);
  renderAll(); showConfirmation(booking); resetForm();
});
E.form.addEventListener("reset", () => setTimeout(resetForm));
E.settingsForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const cateringEmail = E.cateringEmail.value.trim(), itEmail = E.itEmail.value.trim();
  if ((cateringEmail && !emailValid(cateringEmail)) || (itEmail && !emailValid(itEmail))) {
    E.settingsMessage.style.color = "var(--danger)"; E.settingsMessage.textContent = "Informe endereços válidos."; return;
  }
  settings = { cateringEmail, itEmail, provider: E.provider.value }; saveSettings();
  E.settingsMessage.style.color = "var(--success)"; E.settingsMessage.textContent = "Configurações salvas neste navegador.";
});
E.bookingList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]"); if (!button) return;
  const booking = bookings.find((item) => item.id === button.dataset.id); if (!booking) return;
  if (button.dataset.action === "email") showConfirmation(booking);
  if (button.dataset.action === "cancel" && confirm(`Cancelar a reserva ${booking.confirmationCode}?`)) {
    booking.status = "cancelled"; save(); renderAll();
  }
});
E.room.addEventListener("change", updateCapacity);
E.participants.addEventListener("input", updateCapacity);
E.video.addEventListener("change", () => { E.videoOptions.classList.toggle("hidden", !E.video.checked); if (E.video.checked) E.itSupport.checked = true; });
E.cateringSupport.addEventListener("change", () => E.cateringOptions.classList.toggle("hidden", !E.cateringSupport.checked));
E.openBooking.addEventListener("click", () => { $("#nova-reserva").scrollIntoView({ behavior: "smooth" }); setTimeout(() => E.title.focus(), 400); });
E.clearBookings.addEventListener("click", () => { if (bookings.length && confirm("Remover todas as reservas da demonstração?")) { bookings = []; save(); renderAll(); } });
E.closeModal.addEventListener("click", closeConfirmation); E.finishModal.addEventListener("click", closeConfirmation);
E.modal.addEventListener("click", (event) => { if (event.target === E.modal) closeConfirmation(); });
E.previousMonth.addEventListener("click", () => { calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() - 1, 1, 12); renderCalendar(); });
E.nextMonth.addEventListener("click", () => { calendarCursor = new Date(calendarCursor.getFullYear(), calendarCursor.getMonth() + 1, 1, 12); renderCalendar(); });
E.todayButton.addEventListener("click", () => { calendarCursor = new Date(new Date().getFullYear(), new Date().getMonth(), 1, 12); renderCalendar(); });
E.calendarGrid.addEventListener("click", (event) => {
  const day = event.target.closest("button[data-date]"); if (!day || day.dataset.date < dateKey()) return;
  E.date.value = day.dataset.date; $("#nova-reserva").scrollIntoView({ behavior: "smooth" }); setTimeout(() => E.title.focus(), 400);
});
document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeConfirmation(); });
document.querySelectorAll(".nav-link").forEach((link) => link.addEventListener("click", () => {
  document.querySelectorAll(".nav-link").forEach((item) => item.classList.remove("active")); link.classList.add("active");
}));

initializeForm();
renderAll();
