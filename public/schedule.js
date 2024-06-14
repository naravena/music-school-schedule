let currentWeekStart = getMonday(new Date());

document.addEventListener("DOMContentLoaded", () => {
  updateCurrentWeek();
  fetchClases();
});

function fetchClases() {
  const start = formatDate(currentWeekStart);
  const end = formatDate(
    new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
  );
  fetch(`/clases?start=${start}&end=${end}`)
    .then((response) => response.json())
    .then((data) => {
      updateSchedule(data);
    })
    .catch((error) => console.error("Error al obtener clases:", error));
}

function updateSchedule(clases) {
  const scheduleBody = document.getElementById("schedule-body");
  scheduleBody.innerHTML = "";

  const hours = [
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
    "20:00 - 21:00",
  ];

  for (let i = 0; i < hours.length; i++) {
    const row = document.createElement("tr");
    const hourCell = document.createElement("td");
    hourCell.textContent = hours[i];
    row.appendChild(hourCell);

    for (let j = 0; j < 5; j++) {
      // Cambiamos a 5 para dejar espacio a la columna "Combo"
      const dayCell = document.createElement("td");
      const currentDay = new Date(
        currentWeekStart.getTime() + j * 24 * 60 * 60 * 1000
      );
      const date = formatDate(currentDay);
      const filteredClasses = clases.filter(
        (clase) =>
          clase.fecha.startsWith(date) &&
          isClassInHourRange(clase.fecha, hours[i])
      );

      filteredClasses.forEach((clase) => {
        const classInfo = document.createElement("div");
        classInfo.setAttribute("class", "classInfo");
        classInfo.setAttribute("draggable", "true");
        classInfo.setAttribute("ondragstart", "drag(event)");

        const studentName = document.createElement("span");
        studentName.setAttribute("id", "student-name");
        studentName.textContent = clase.nombre;
        studentName.style.cursor = "pointer";
        studentName.onclick = () => showUpdateModal(clase);

        const studentPhone = document.createElement("span");
        studentPhone.setAttribute("id", "student-phone");
        studentPhone.textContent = clase.telefono;

        const aulaName = document.createElement("span");
        aulaName.setAttribute("id", "aula-name");
        aulaName.textContent = ` ${clase.desc_aula}`;
        aulaName.style.fontWeight = "bold";

        classInfo.appendChild(studentName);
        classInfo.appendChild(document.createElement("br"));
        classInfo.appendChild(studentPhone);
        classInfo.appendChild(document.createElement("br"));
        classInfo.appendChild(aulaName);
        classInfo.appendChild(document.createElement("br"));
        classInfo.appendChild(document.createElement("br"));
        dayCell.appendChild(classInfo);
      });

      row.appendChild(dayCell);
    }

    if (i == 0) {

      const comboCell = document.createElement("td");
      comboCell.setAttribute("id", "combo-cell");
      comboCell.setAttribute("rowspan", "6");
      comboCell.addEventListener("dragover", allowDrop);
      comboCell.addEventListener("drop", drop);
      comboCell.addEventListener("dragenter", (event) =>
        event.target.classList.add("highlight")
      );
      comboCell.addEventListener("dragleave", (event) =>
        event.target.classList.remove("highlight")
      );
      row.appendChild(comboCell);
    }

    scheduleBody.appendChild(row);
  }
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.innerHTML);
}

function allowDrop(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const data = event.dataTransfer.getData("text");
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, "text/html");
  const phoneNumber = doc.querySelector("#student-phone").textContent;
  let cellText = event.target.textContent;
  let phoneNumbers = cellText ? cellText.split("\n") : [];

  if (!phoneNumbers.includes(phoneNumber)) {
    phoneNumbers.push(phoneNumber);
    event.target.textContent = phoneNumbers.join("\n");
  }
}


function copyToClipboard() {
  const comboCells = document.querySelectorAll("#combo-cell");
  let allNumbers = [];

  comboCells.forEach((cell) => {
    const phoneNumbers = cell.textContent
      .split("\n")
      .filter((number) => number !== "");
    allNumbers = allNumbers.concat(phoneNumbers);
  });

  const uniqueNumbers = [...new Set(allNumbers)].join(", ");

  navigator.clipboard
    .writeText(uniqueNumbers)
    .then(() => {
      alert("Números copiados al portapapeles: " + uniqueNumbers);
    })
    .catch((err) => {
      console.error("Error al copiar al portapapeles: ", err);
    });
}

function getMonday(d) {
  d = new Date(d);
  const day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function formatDate(date) {
  const d = new Date(date);
  let month = "" + (d.getMonth() + 1);
  let day = "" + d.getDate();
  const year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

function isClassInHourRange(dateTime, hourRange) {
  const [startHour, endHour] = hourRange.split(" - ");
  const classTime = dateTime.split(" ")[1];

  return classTime >= startHour && classTime < endHour;
}

function navigateWeek(offset) {
  currentWeekStart.setDate(currentWeekStart.getDate() + offset * 7);
  updateCurrentWeek();
  fetchClases();
}

function navigateToCurrentWeek() {
  currentWeekStart = getMonday(new Date());
  updateCurrentWeek();
  fetchClases();
}

function updateCurrentWeek() {
  const currentWeekDiv = document.getElementById("current-week");
  const endOfWeek = new Date(currentWeekStart);
  endOfWeek.setDate(currentWeekStart.getDate() + 6);
  currentWeekDiv.textContent = `Semana del ${formatDate(
    currentWeekStart
  )} al ${formatDate(endOfWeek)}`;
}

function showUpdateModal(clase) {
  const modal = document.getElementById("update-modal");
  document.getElementById("update-alumno-id").value = clase.id_alumno;
  document.getElementById("update-alumno-nombre").value = clase.nombre;
  document.getElementById("update-aula").value = clase.id_aula;
  modal.style.display = "block";
}

function closeModal() {
  const modal = document.getElementById("update-modal");
  modal.style.display = "none";
}

function submitUpdate(event) {
  event.preventDefault();
  const idAlumno = document.getElementById("update-alumno-id").value;
  const idAula = document.getElementById("update-aula").value;

  fetch("/update-class", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idAlumno, idAula }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        closeModal();
        fetchClases(); // Refresh the schedule
      } else {
        console.error("Error al actualizar la clase:", data.message);
      }
    })
    .catch((error) => console.error("Error al actualizar la clase:", error));
}
