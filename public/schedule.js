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
  const mobileDropdowns = document.getElementById("mobile-dropdowns");
  scheduleBody.innerHTML = "";
  mobileDropdowns.innerHTML = "";

  const hours = [
    "16:00 - 17:00",
    "17:00 - 18:00",
    "18:00 - 19:00",
    "19:00 - 20:00",
    "20:00 - 21:00",
  ];

  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
  
  // Desktop view
  for (let i = 0; i < hours.length; i++) {
    const row = document.createElement("tr");
    const hourCell = document.createElement("td");
    hourCell.textContent = hours[i];
    row.appendChild(hourCell);

    for (let j = 0; j < 5; j++) {
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

  // Mobile view
  for (let j = 0; j < 5; j++) {
    const dropdown = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = days[j];
    dropdown.appendChild(summary);

    const dayContent = document.createElement("div");

    for (let i = 0; i < hours.length; i++) {
      const currentDay = new Date(
        currentWeekStart.getTime() + j * 24 * 60 * 60 * 1000
      );
      const date = formatDate(currentDay);
      const filteredClasses = clases.filter(
        (clase) =>
          clase.fecha.startsWith(date) &&
          isClassInHourRange(clase.fecha, hours[i])
      );

      const hourBlock = document.createElement("div");
      const hourTitle = document.createElement("strong");
      hourTitle.textContent = hours[i];
      hourBlock.appendChild(hourTitle);

      filteredClasses.forEach((clase) => {
        const classInfo = document.createElement("div");
        classInfo.setAttribute("class", "classInfo");

        const studentName = document.createElement("span");
        studentName.textContent = clase.nombre;
        studentName.style.cursor = "pointer";
        studentName.onclick = () => showUpdateModal(clase);

        const studentPhone = document.createElement("span");
        studentPhone.textContent = clase.telefono;

        const aulaName = document.createElement("span");
        aulaName.textContent = ` ${clase.desc_aula}`;
        aulaName.style.fontWeight = "bold";

        classInfo.appendChild(studentName);
        classInfo.appendChild(document.createElement("br"));
        classInfo.appendChild(studentPhone);
        classInfo.appendChild(document.createElement("br"));
        classInfo.appendChild(aulaName);
        classInfo.appendChild(document.createElement("br"));
        classInfo.appendChild(document.createElement("br"));
        hourBlock.appendChild(classInfo);
      });

      dayContent.appendChild(hourBlock);
    }
    //TODO: arreglar responsive
    dropdown.appendChild(dayContent);
    if(window.innerWidth < 768){
      mobileDropdowns.appendChild(dropdown);
      mobileDropdowns.hidden = true;
    }else{
      mobileDropdowns.hidden = false;
    }
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

  if (!event.target.innerHTML.includes(phoneNumber)) {
    event.target.innerHTML += data;
  }
}

function getMonday(d) {
  d = new Date(d);
  const day = d.getDay(),
    diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isClassInHourRange(classDateTime, hourRange) {
  const classHour = new Date(classDateTime).getHours();
  const [startHour] = hourRange.split(" - ").map((time) => parseInt(time));
  return classHour === startHour;
}

function navigateWeek(direction) {
  currentWeekStart.setDate(currentWeekStart.getDate() + direction * 7);
  updateCurrentWeek();
  fetchClases();
}

function navigateToCurrentWeek() {
  currentWeekStart = getMonday(new Date());
  updateCurrentWeek();
  fetchClases();
}

function updateCurrentWeek() {
  const start = formatDate(currentWeekStart);
  const end = formatDate(
    new Date(currentWeekStart.getTime() + 6 * 24 * 60 * 60 * 1000)
  );
  document.getElementById("current-week").textContent = `${start} - ${end}`;
}

function copyToClipboard() {
  const comboCell = document.getElementById("combo-cell");
  const phoneNumbers = Array.from(comboCell.getElementsByTagName("span"))
    .filter((span) => span.id === "student-phone")
    .map((span) => span.textContent.trim());
  const uniquePhoneNumbers = [...new Set(phoneNumbers)];
  const phoneNumberString = uniquePhoneNumbers.join(", ");
  navigator.clipboard.writeText(phoneNumberString).then(
    () => alert("Números de teléfono copiados al portapapeles"),
    (err) => alert("Error al copiar al portapapeles: " + err)
  );
}

function showUpdateModal(clase) {
  const modal = document.getElementById("update-modal");
  document.getElementById("update-alumno-id").value = clase.id;
  document.getElementById("update-alumno-nombre").value = clase.nombre;
  document.getElementById("update-aula").value = clase.aula;
  modal.style.display = "block";
}

function closeModal() {
  document.getElementById("update-modal").style.display = "none";
}

function submitUpdate(event) {
  event.preventDefault();
  const id = document.getElementById("update-alumno-id").value;
  const aula = document.getElementById("update-aula").value;

  fetch(`/clases/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ aula }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al actualizar la clase");
      }
      return response.json();
    })
    .then(() => {
      closeModal();
      fetchClases();
    })
    .catch((error) => {
      console.error("Error al actualizar la clase:", error);
      alert("Error al actualizar la clase");
    });
}
