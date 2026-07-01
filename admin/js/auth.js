import { supabase } from './supabase.js';

const { data: { session } } = await supabase.auth.getSession();
if (session) {
    window.location.replace('index.html');
}

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;
    const errorEl = document.getElementById('error-message');
    const btn = e.target.querySelector('button[type="submit"]');

    btn.disabled = true;
    btn.textContent = 'Verificando...';
    errorEl.textContent = '';

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
        errorEl.textContent = 'Email o contraseña incorrectos.';
        btn.disabled = false;
        btn.textContent = 'Ingresar';
    } else {
        window.location.replace('index.html');
    }
});
