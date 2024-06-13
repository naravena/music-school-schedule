document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("add-class-form");
  const messageDiv = document.getElementById("message");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const student = document.getElementById("student").value.trim();
    const classroom = document.getElementById("classroom").value.trim();
    const date = document.getElementById("date").value;
    const time = document.getElementById("time").value;
    if (student && classroom && date && time) {
      const datetime = `${date} ${time}`;
      const body = JSON.stringify({ student, classroom, datetime });
      fetch("/add-class", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            messageDiv.textContent = "Clase añadida con éxito";
            messageDiv.style.display = "block";
            setTimeout(() => {
                window.location.href = '/index.html';
            }, 2000); // Redirección después de 2 segundos
          } else {
            alert("Error al añadir clase: " + data.message);
          }
        })
        .catch((error) => console.error("Error:", error));
    } else {
      alert("Por favor, complete todos los campos.");
    }
  });

  fetch("/students")
    .then((response) => response.json())
    .then((data) => {
      const studentSelect = document.getElementById("student");
      data.forEach((student) => {
        const option = document.createElement("option");
        option.value = student.id_alumno;
        option.textContent = student.nombre;
        studentSelect.appendChild(option);
      });

      // Search functionality
      const searchInput = document.getElementById("student-search");
      searchInput.addEventListener("input", () => {
        const searchValue = searchInput.value.toLowerCase();
        Array.from(studentSelect.options).forEach((option) => {
          option.style.display = option.textContent
            .toLowerCase()
            .includes(searchValue)
            ? ""
            : "none";
        });
      });
    });

  fetch("/aulas")
    .then((response) => response.json())
    .then((data) => {
      const classroomSelect = document.getElementById("classroom");
      data.forEach((classroom) => {
        const option = document.createElement("option");
        option.value = classroom.id_aula;
        option.textContent = classroom.desc_aula;
        classroomSelect.appendChild(option);
      });
    });
});
