document.addEventListener('DOMContentLoaded', function() {
	const form = document.getElementById('contactForm');
	if (!form) return;

	const selectors = {
		nome: document.getElementById('nome'),
		data: document.getElementById('dataNascimento'),
		telefone: document.getElementById('telefone'),
		email: document.getElementById('email'),
		mensagem: document.getElementById('mensagem'),
	};

	function setError(el, msg) {
		const err = document.getElementById('err-' + el.id.split(/(?=[A-Z])|-/).shift());
		if (err) err.textContent = msg;
		el.classList.add('is-invalid');
	}

	function clearError(el) {
		const err = document.getElementById('err-' + el.id.split(/(?=[A-Z])|-/).shift());
		if (err) err.textContent = '';
		el.classList.remove('is-invalid');
	}

	function validarEmail(value) {
		const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return re.test(value);
	}

	function validarTelefone(value) {
		// Permite dígitos
		const cleaned = value.replace(/\D/g, '');
		const allowed = /^[0-9\s()+-]{7,20}$/;
		return allowed.test(value) && cleaned.length >= 9 && cleaned.length <= 15;
	}

	function calcularIdade(dataStr) {
		if (!dataStr) return 0;
		const hoje = new Date();
		const nasc = new Date(dataStr);
		let idade = hoje.getFullYear() - nasc.getFullYear();
		const m = hoje.getMonth() - nasc.getMonth();
		if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) {
			idade--;
		}
		return idade;
	}

	form.addEventListener('submit', function(e) {
		e.preventDefault();

		let valido = true;

		// Nome
		const nomeVal = selectors.nome.value.trim();
		if (!nomeVal) {
			setError(selectors.nome, 'O nome é obrigatório.');
			valido = false;
		} else {
			clearError(selectors.nome);
		}

		// Data Nascimento
		const dataVal = selectors.data.value;
		const idade = calcularIdade(dataVal);
		if (!dataVal) {
			setError(selectors.data, 'A data de nascimento é obrigatória.');
			valido = false;
		} else if (idade < 18) {
			setError(selectors.data, 'É necessário ter mais de 18 anos.');
			valido = false;
		} else {
			clearError(selectors.data);
		}

		// Telefone
		const telVal = selectors.telefone.value.trim();
		if (!telVal) {
			setError(selectors.telefone, 'O telefone é obrigatório.');
			valido = false;
		} else if (!validarTelefone(telVal)) {
			setError(selectors.telefone, 'Formato de telefone inválido.');
			valido = false;
		} else {
			clearError(selectors.telefone);
		}

		// Email
		const emailVal = selectors.email.value.trim();
		if (!emailVal) {
			setError(selectors.email, 'O email é obrigatório.');
			valido = false;
		} else if (!validarEmail(emailVal)) {
			setError(selectors.email, 'Formato de email inválido.');
			valido = false;
		} else {
			clearError(selectors.email);
		}

		// Mensagem
		const msgVal = selectors.mensagem.value.trim();
		if (!msgVal) {
			setError(selectors.mensagem, 'A mensagem é obrigatória.');
			valido = false;
		} else {
			clearError(selectors.mensagem);
		}

		if (!valido) {
			return;
		}

		// Preparar (fictício)
		const to = 'lucasomena3325@gmail.com';
		const subject = encodeURIComponent('Contacto - ' + nomeVal);
		const body = encodeURIComponent(
			'Nome: ' + nomeVal + '\n' +
			'Data de Nascimento: ' + dataVal + '\n' +
			'Telefone: ' + telVal + '\n' +
			'Email: ' + emailVal + '\n\n' +
			'Mensagem:\n' + msgVal
		);

		// Mostrar abrir cliente de email
		const modalEl = document.getElementById('successModal');
		if (modalEl && typeof bootstrap !== 'undefined') {
			const bsModal = new bootstrap.Modal(modalEl);
			const sendBtn = modalEl.querySelector('#modalSendBtn');
			if (sendBtn) {
				sendBtn.onclick = function() {
					window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
					form.reset();
					bsModal.hide();
				};
			}
			bsModal.show();
		} else {
			alert('Dados enviados com sucesso. Obrigado!');
			window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
			form.reset();
		}
	});
});

