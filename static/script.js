document.addEventListener('DOMContentLoaded', () => {

    // 1. NAVEGACIÓN Y RUTEO ENTRE APARTADOS
    const navLinks = document.querySelectorAll('[data-page]');
    const pageSections = document.querySelectorAll('.page-section');
    const mobileMenu = document.getElementById('mobile-menu');
    const navList = document.getElementById('nav-list');

    function switchPage(pageId) {
        pageSections.forEach(section => {
            section.classList.remove('active-page');
        });

        document.querySelectorAll('nav ul li a').forEach(link => {
            link.classList.remove('active');
        });

        const targetSection = document.getElementById(`page-${pageId}`);
        if (targetSection) {
            targetSection.classList.add('active-page');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        const activeLink = document.querySelector(`nav ul li a[data-page="${pageId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        if (navList) navList.classList.remove('active');
    }

    navLinks.forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = element.getAttribute('data-page');
            if (pageId) switchPage(pageId);
        });
    });

    if (mobileMenu) {
        mobileMenu.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }

    // 2. SIMULADOR DEMO NFC
    const btnDemo = document.getElementById('btn-generate-demo');
    const inputDemo = document.getElementById('demo-user-input');
    const phoneScreen = document.getElementById('phone-screen-target');

    if (btnDemo && inputDemo && phoneScreen) {
        btnDemo.addEventListener('click', () => {
            const user = inputDemo.value.trim();
            if (!user) {
                alert('Por favor ingresa un usuario o número telefónico.');
                return;
            }

            phoneScreen.innerHTML = `
                <i class="fas fa-check-circle" style="font-size:2.5rem; color:#10b981; margin-bottom:10px;"></i>
                <h4 style="color:#fff; font-size:0.9rem;">¡NFC Detectado!</h4>
                <p style="font-size:0.8rem; color:#00f2fe; margin-top:5px;">Conectando a perfil de ${user}...</p>
            `;
        });
    }

    // 3. PERSONALIZADOR DE COLOR DE LLAVERO
    const colorBtns = document.querySelectorAll('.color-btn');
    const keychainRender = document.getElementById('keychain-render');

    colorBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            colorBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const color = btn.getAttribute('data-color');
            if (keychainRender) {
                keychainRender.style.background = color;
                keychainRender.style.boxShadow = `0 0 25px ${color}`;
            }
        });
    });

    // 4. CALCULADORA DE PRESUPUESTO
    const calcItems = document.querySelectorAll('.calc-item');
    const calcTotalVal = document.getElementById('calc-total-val');

    function updateCalculator() {
        let total = 0;
        calcItems.forEach(item => {
            if (item.checked) {
                total += parseFloat(item.value);
            }
        });
        if (calcTotalVal) {
            calcTotalVal.textContent = `$${total.toFixed(2)}`;
        }
    }

    calcItems.forEach(item => {
        item.addEventListener('change', updateCalculator);
    });

    // 5. FILTROS DE GALERÍA
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                if (filter === 'all' || item.getAttribute('data-category') === filter) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });

    // 6. FORMULARIO DE CONTACTO Y TOASTS
    function showToast(message) {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    }

    const formContacto = document.getElementById('form-contacto');
    if (formContacto) {
        formContacto.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('nombre').value;
            showToast(`¡Gracias ${nombre}! Tu mensaje ha sido enviado.`);
            formContacto.reset();
        });
    }

    // 7. CHATBOT SIMULADO
    const chatBtn = document.getElementById('chat-btn');
    const chatBox = document.getElementById('chat-box');
    const chatClose = document.getElementById('chat-close');
    const chatSend = document.getElementById('chat-send');
    const chatInput = document.getElementById('chat-input');
    const chatBody = document.getElementById('chat-body');

    if (chatBtn) chatBtn.addEventListener('click', () => chatBox.classList.toggle('active'));
    if (chatClose) chatClose.addEventListener('click', () => chatBox.classList.remove('active'));

    function sendChatMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        const userMsg = document.createElement('div');
        userMsg.className = 'chat-message user';
        userMsg.textContent = text;
        chatBody.appendChild(userMsg);
        chatInput.value = '';

        setTimeout(() => {
            const botMsg = document.createElement('div');
            botMsg.className = 'chat-message bot';
            let resp = "Gracias por escribirnos. Un integrante de TechBits te responderá muy pronto.";
            const lower = text.toLowerCase();
            
            if (lower.includes('precio') || lower.includes('costo')) resp = "Los llaveros NFC cuestan $12.00 y los perfiles web desde $25.00.";
            if (lower.includes('nfc') || lower.includes('llavero')) resp = "Los llaveros NFC permiten compartir tus redes sociales al instante al acercar tu smartphone.";
            
            botMsg.textContent = resp;
            chatBody.appendChild(botMsg);
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 1000);
    }

    if (chatSend) chatSend.addEventListener('click', sendChatMessage);
    if (chatInput) chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendChatMessage(); });
});

// Formulario de contacto conectado a la Base de Datos
const formContacto = document.getElementById('form-contacto');
if (formContacto) {
    formContacto.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();

        try {
            const response = await fetch('http://127.0.0.1:5000/api/contacto', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, email, mensaje })
            });

            const result = await response.json();

            if (response.ok) {
                showToast(`¡Gracias ${nombre}! Tus datos se guardaron en la base de datos.`);
                formContacto.reset();
            } else {
                showToast(`Error: ${result.error}`);
            }
        } catch (error) {
            console.error('Error de conexión con el servidor:', error);
            showToast('Error al conectar con la base de datos.');
        }
    });
}