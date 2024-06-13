document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('add-student-form');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const instrument = document.getElementById('instrument').value;
        if (name && phone && instrument) {
            const body = JSON.stringify({ name, phone, instrument })
            fetch("/add-student", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Alumno añadido con éxito');
                    form.reset();
                } else {
                    alert('Error al añadir alumno: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        } else {
            alert('Por favor, complete todos los campos.');
        }
    });

    fetch("/instruments")
        .then(response => response.json())
        .then(data => {
            const instrumentSelect = document.getElementById('instrument');
            data.forEach(instrument => {
                const option = document.createElement('option');
                option.value = instrument.id_instrumento;
                option.textContent = instrument.desc_instrumento;
                instrumentSelect.appendChild(option);
            });
        });
});
