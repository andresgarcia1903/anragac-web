document.addEventListener('DOMContentLoaded', () => {
  // 1. Control del Menú Hamburguesa Móvil
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // 2. Sistema de Pestañas (Privacidad y Eliminación de Datos)
  function cambiarTab(tabId) {
    const contents = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-btn');

    contents.forEach(content => content.classList.remove('active'));
    buttons.forEach(btn => btn.classList.remove('active'));

    const targetContent = document.getElementById(tabId);
    const targetBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);

    if (targetContent) targetContent.classList.add('active');
    if (targetBtn) targetBtn.classList.add('active');

    const privSection = document.getElementById('privacidad');
    if (privSection) {
      privSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      cambiarTab(tabId);
    });
  });

  document.querySelectorAll('[data-tab]').forEach(el => {
    if (!el.classList.contains('tab-btn')) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const tabId = el.getAttribute('data-tab');
        cambiarTab(tabId);
      });
    }
  });

  // 3. Manejo del Formulario conectado a Firebase Firestore
  const deleteForm = document.getElementById('deleteDataForm');
  const deleteFeedback = document.getElementById('deleteFeedback');

  if (deleteForm) {
    deleteForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const email = document.getElementById('userEmail').value.trim();
      const appName = document.getElementById('appSelect').value;
      const reason = document.getElementById('deleteReason').value.trim();

      if (!email) return;

      const ticketId = 'ANR-' + Math.floor(100000 + Math.random() * 900000);

      try {
        const { collection, addDoc, serverTimestamp } = await import("https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js");

        await addDoc(collection(window.db, "solicitudes_eliminacion"), {
          ticketId: ticketId,
          correo: email,
          aplicacion: appName,
          motivo: reason || "No especificado",
          fecha: serverTimestamp(),
          estado: "Pendiente"
        });

        deleteFeedback.style.display = 'block';
        deleteFeedback.innerHTML = `
          <strong>✔ ¡Solicitud registrada con éxito en Firebase! (Radicado: ${ticketId})</strong><br>
          Hemos guardado tu petición para eliminar los datos de <strong>${email}</strong> en <em>${appName}</em>. 
          El proceso se completará en un plazo máximo de 48 a 72 horas hábiles.
        `;
        deleteForm.reset();

      } catch (error) {
        console.error("Error al guardar en Firebase:", error);
        alert("Hubo un error al registrar la solicitud en la base de datos. Por favor, intenta de nuevo.");
      }
    });
  }
});