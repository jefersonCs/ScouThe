document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuarioDados'));
  
    if (!usuario || !usuario.email) {
      window.location.href = 'index.html';
      return;
    }
  
    preencherPerfil(usuario);
    configurarEdicaoPerfil(usuario);
  
    // --- Código para o modal do perfil ---
    const fotoPerfilHeader = document.querySelector('#profile-container img');
    const modal = criarModalPerfil(); // cria e insere o modal no body
    const btnFechar = modal.querySelector('#fecharModal');
    const linkVerPerfil = modal.querySelector('a[href="perfil.html"]');
    const btnSair = modal.querySelector('#btnSair');
  
    fotoPerfilHeader.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.remove('d-none');
    });
  
    btnFechar.addEventListener('click', () => {
      modal.classList.add('d-none');
    });
  
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('d-none');
      }
    });
  
    linkVerPerfil.addEventListener('click', () => {
      modal.classList.add('d-none');
      // navegação ocorre automaticamente pelo href
    });
  
    btnSair.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('usuarioDados');
      alert('Logout realizado! Redirecionando...');
      modal.classList.add('d-none');
      window.location.href = 'index.html'; // ou página de login
    });
  });
  
  // Função para criar o modal dinamicamente e inserir no body
  function criarModalPerfil() {
    const modalHtml = `
      <div id="modalPerfil" class="modal-overlay d-none">
        <div class="modal-content">
          <button id="fecharModal" class="close-btn">&times;</button>
          <ul class="modal-list">
            <li><a href="perfil.html">Ver Perfil</a></li>
            <li><a href="#" id="btnSair">Sair da Conta</a></li>
          </ul>
        </div>
      </div>
    `;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = modalHtml;
    document.body.appendChild(wrapper.firstElementChild);
    return document.getElementById('modalPerfil');
  }
  
  // Função para preencher os dados do perfil
  function preencherPerfil(usuario) {
    const imgPerfilHeader = document.querySelector('#profile-container img');
    if (imgPerfilHeader && usuario.foto) {
      imgPerfilHeader.src = usuario.foto;
    }
  
    // Preenche os campos no perfil
    document.getElementById('nomeCompleto').textContent = `${usuario.nome || ''} ${usuario.sobrenome || ''}`.trim();
    document.getElementById('nascimento').textContent = usuario.nascimento || '--/--/----';
    document.getElementById('tipoConta').textContent = formatarTipoConta(usuario.tipoConta);
    document.getElementById('bio').textContent = usuario.bio || '--';
    document.getElementById('modalidade').textContent = usuario.modalidade || '--';
  
    // Idade calculada
    const idade = calcularIdade(usuario.nascimento);
    document.getElementById('idade').textContent = idade !== null ? idade + ' anos' : '--';
  }
  
  // Função para configurar edição do perfil
  function configurarEdicaoPerfil(usuario) {
    const btnEditarPerfil = document.getElementById('btn-editar-perfil');
    if (!btnEditarPerfil) return;
  
    const nomeCompletoEl = document.getElementById('nomeCompleto');
    const nascimentoSpan = document.getElementById('nascimento');
    const tipoContaSpan = document.getElementById('tipoConta');
    const bioSpan = document.getElementById('bio');
    const idadeSpan = document.getElementById('idade');
    const modalidadeSpan = document.getElementById('modalidade');
  
    let editando = false;
  
    btnEditarPerfil.addEventListener('click', () => {
      if (!editando) {
        btnEditarPerfil.textContent = 'Salvar Alterações';
  
        // Nome
        const inputNome = document.createElement('input');
        inputNome.type = 'text';
        inputNome.id = 'inputNome';
        inputNome.className = 'form-control mb-2';
        inputNome.value = usuario.nome || '';
  
        const inputSobrenome = document.createElement('input');
        inputSobrenome.type = 'text';
        inputSobrenome.id = 'inputSobrenome';
        inputSobrenome.className = 'form-control mb-2';
        inputSobrenome.value = usuario.sobrenome || '';
  
        nomeCompletoEl.textContent = '';
        nomeCompletoEl.appendChild(inputNome);
        nomeCompletoEl.appendChild(inputSobrenome);
  
        // Nascimento
        const inputNascimento = document.createElement('input');
        inputNascimento.type = 'date';
        inputNascimento.id = 'inputNascimento';
        inputNascimento.className = 'form-control mb-2';
        inputNascimento.value = usuario.nascimento || '';
        nascimentoSpan.replaceWith(inputNascimento);
  
        // Tipo Conta
        const selectTipoConta = document.createElement('select');
        selectTipoConta.id = 'selectTipoConta';
        selectTipoConta.className = 'form-select mb-2';
        ['', '1', '2', '3'].forEach(valor => {
          const option = document.createElement('option');
          option.value = valor;
          option.textContent = formatarTipoConta(valor);
          if (valor === (usuario.tipoConta || '')) option.selected = true;
          selectTipoConta.appendChild(option);
        });
        tipoContaSpan.replaceWith(selectTipoConta);
  
        // Bio
        const textareaBio = document.createElement('textarea');
        textareaBio.id = 'textareaBio';
        textareaBio.className = 'form-control mb-2';
        textareaBio.rows = 3;
        textareaBio.value = usuario.bio || '';
        bioSpan.replaceWith(textareaBio);
  
        // Modalidade
        const inputModalidade = document.createElement('input');
        inputModalidade.type = 'text';
        inputModalidade.id = 'inputModalidade';
        inputModalidade.className = 'form-control mb-2';
        inputModalidade.value = usuario.modalidade || '';
        modalidadeSpan.replaceWith(inputModalidade);
  
        editando = true;
      } else {
        // Salvar
        const inputNome = document.getElementById('inputNome');
        const inputSobrenome = document.getElementById('inputSobrenome');
        const inputNascimento = document.getElementById('inputNascimento');
        const selectTipoConta = document.getElementById('selectTipoConta');
        const textareaBio = document.getElementById('textareaBio');
        const inputModalidade = document.getElementById('inputModalidade');
  
        if (!inputNome.value.trim()) {
          alert('Por favor, preencha o nome.');
          inputNome.focus();
          return;
        }
        if (!inputNascimento.value) {
          alert('Por favor, preencha a data de nascimento.');
          inputNascimento.focus();
          return;
        }
        if (!selectTipoConta.value) {
          alert('Por favor, selecione o tipo de conta.');
          selectTipoConta.focus();
          return;
        }
  
        // Atualiza objeto
        usuario.nome = inputNome.value.trim();
        usuario.sobrenome = inputSobrenome.value.trim();
        usuario.nascimento = inputNascimento.value;
        usuario.tipoConta = selectTipoConta.value;
        usuario.bio = textareaBio.value.trim();
        usuario.modalidade = inputModalidade.value.trim();
  
        localStorage.setItem('usuarioDados', JSON.stringify(usuario));
  
        // Atualizar interface
        nomeCompletoEl.textContent = `${usuario.nome} ${usuario.sobrenome}`;
        const novoNascimento = document.createElement('span');
        novoNascimento.id = 'nascimento';
        novoNascimento.textContent = usuario.nascimento;
        inputNascimento.replaceWith(novoNascimento);
  
        const novoTipoConta = document.createElement('span');
        novoTipoConta.id = 'tipoConta';
        novoTipoConta.textContent = formatarTipoConta(usuario.tipoConta);
        selectTipoConta.replaceWith(novoTipoConta);
  
        const novaBio = document.createElement('span');
        novaBio.id = 'bio';
        novaBio.textContent = usuario.bio || '--';
        textareaBio.replaceWith(novaBio);
  
        const novaModalidade = document.createElement('span');
        novaModalidade.id = 'modalidade';
        novaModalidade.textContent = usuario.modalidade || '--';
        inputModalidade.replaceWith(novaModalidade);
  
        const novaIdade = calcularIdade(usuario.nascimento);
        idadeSpan.textContent = novaIdade !== null ? novaIdade + ' anos' : '--';
  
        btnEditarPerfil.textContent = 'Editar Perfil';
        editando = false;
  
        alert('Perfil atualizado com sucesso!');
      }
    });
  }
  
  // Função para calcular idade
  function calcularIdade(dataNascimento) {
    if (!dataNascimento) return null;
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const m = hoje.getMonth() - nascimento.getMonth();
    if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  }
  
  // Função para formatar tipo de conta
  function formatarTipoConta(tipo) {
    switch (tipo) {
      case '1':
        return 'Equipe Esportiva';
      case '2':
        return 'Profissional da Área';
      case '3':
        return 'Usuário Atleta';
      default:
        return 'Não informado';
    }
  }
  
  // Função para criar o modal dinamicamente e inserir no body
  function criarModalPerfil() {
    const modalHtml = `
      <div id="modalPerfil" class="modal-overlay d-none">
        <div class="modal-content">
          <button id="fecharModal" class="close-btn">&times;</button>
          <ul class="modal-list">
            <li><a href="perfil.html">Ver Perfil</a></li>
            <li><a href="#" id="btnSair">Sair da Conta</a></li>
          </ul>
        </div>
      </div>
    `;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = modalHtml;
    document.body.appendChild(wrapper.firstElementChild);
    return document.getElementById('modalPerfil');
  }
  