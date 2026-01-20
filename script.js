document.addEventListener('DOMContentLoaded', () => {

    // --- Navigation Toggle ---
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    if (burger) {
        burger.addEventListener('click', () => {
            // Toggle Nav
            nav.classList.toggle('nav-active');

            // Animate Links
            navLinks.forEach((link, index) => {
                if (link.style.animation) {
                    link.style.animation = '';
                } else {
                    link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
                }
            });

            // Burger Animation
            burger.classList.toggle('toggle');
        });
    }

    // --- Booking System Logic ---
    const serviceSelect = document.getElementById('service');
    const timeSelect = document.getElementById('time');
    const bookingForm = document.getElementById('bookingForm');

    // Set Date restriction: Tomorrow onwards
    const dateInput = document.getElementById('date');
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = tomorrow.toISOString().split('T')[0];

    // Function to generate time slots
    function generateTimeSlots(intervalMinutes) {
        // ... (Keep existing logic, just re-inserting context if needed, but I'm replacing block so need to be careful)
        // Actually, I should use replace_file_content on the init block to add the date logic, and another call for the fetch logic?
        // Or just one big replace if they are close. They are in the same file.
        // I will replace the START of the Booking System Logic to add the date code.
    }

    function generateTimeSlots(intervalMinutes) {
        timeSelect.innerHTML = '<option value="" disabled selected>Selecciona una hora</option>';

        const startHour = 10; // 10:00 AM
        const endHour = 21;   // 09:00 PM (Last slot might need adjustment based on duration, but usually last booking is before closing)

        const startTime = startHour * 60; // minutes from midnight
        const endTime = endHour * 60;

        for (let time = startTime; time < endTime; time += intervalMinutes) {
            const h = Math.floor(time / 60);
            const m = time % 60;

            const hours = h.toString().padStart(2, '0');
            const minutes = m.toString().padStart(2, '0');
            const timeString = `${hours}:${minutes}`;

            const option = document.createElement('option');
            option.value = timeString;
            option.textContent = timeString;
            timeSelect.appendChild(option);
        }
    }

    // Listen for Service Change
    serviceSelect.addEventListener('change', function () {
        const selectedOption = this.options[this.selectedIndex];
        const duration = parseInt(selectedOption.getAttribute('data-duration'));

        if (duration) {
            timeSelect.disabled = false;
            // The user requested: "si la cita es de 15 minutos que solo deje seleccionar de 15 en 15 minutos..."
            // We use the service duration as the interval.
            // Note: "Cortar y barba" is 40 min. Standard logic usually implies slots are fixed grid (e.g. every 15 mins), 
            // but the request asks for specific intervals based on service. 
            // If duration is 40, intervals will be 10:00, 10:40, 11:20...
            // If duration is 30, intervals 10:00, 10:30...
            generateTimeSlots(duration);
        }
    });

    // Handle Reservation Submit
    bookingForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            employee: document.getElementById('employee').value,
            service: document.getElementById('service').value, // This is the value, name of service
            date: document.getElementById('date').value,
            time: document.getElementById('time').value,
            type: 'booking' // Identifier for the webhook
        };

        const submitBtn = bookingForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        try {
            // Changed from webhook-test to webhook for production use
            const response = await fetch('https://unstormable-trothless-gilberto.ngrok-free.dev/webhook/ad75122a-497e-41ee-9d8d-3f254f51b366', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('¡Reserva confirmada con éxito! Te esperamos.');
                bookingForm.reset();
                timeSelect.disabled = true;
                timeSelect.innerHTML = '<option value="">Selecciona primero un servicio</option>';
            } else {
                console.error('Submission failed:', response.status, response.statusText);
                alert(`Hubo un error (${response.status}). Por favor, inténtalo de nuevo o contacta con nosotros.`);
            }
        } catch (error) {
            console.error('Network Error:', error);
            alert('Error de conexión: ' + error.message + '. Por favor revisa tu internet o intenta más tarde.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });

    // --- Cancellation System Logic ---
    const cancellationForm = document.getElementById('cancellationForm');

    cancellationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: document.getElementById('cancelName').value,
            email: document.getElementById('cancelEmail').value,
            type: 'cancellation'
        };

        const submitBtn = cancellationForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Procesando...';
        submitBtn.disabled = true;

        try {
            // Using the same webhook (production)
            const response = await fetch('https://unstormable-trothless-gilberto.ngrok-free.dev/webhook/ad75122a-497e-41ee-9d8d-3f254f51b366', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Solicitud de cancelación enviada correctamente.');
                cancellationForm.reset();
            } else {
                alert('Hubo un error al enviar la solicitud.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error de conexión.');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
});
