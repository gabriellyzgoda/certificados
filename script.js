// Define a data atual como padrão
document.getElementById('certificateDate').value = new Date().toISOString().split('T')[0];

function updateCertificate() {
    const participantName = document.getElementById('participantName').value || '[Nome do Participante]';
    const instructor = document.getElementById('instructor').value || '[Instrutor]';
    const institution = document.getElementById('institution').value || '[Instituição]';
    const certificateDate = document.getElementById('certificateDate').value;

    // Atualizar elementos do certificado
    document.getElementById('displayName').textContent = participantName;
    document.getElementById('displayInstructor').textContent = instructor;
    document.getElementById('displayInstitution').textContent = institution;

    // Atualizar descrição (mantendo o texto fixo como você queria)
    document.getElementById('displayDescription').innerHTML = 
        `concluiu com aproveitamento o curso de <strong>Educação Especial</strong> com carga horária de <strong>40 horas</strong>.`;

    // Atualizar data
    if (certificateDate) {
        const date = new Date(certificateDate + 'T00:00:00'); // Adiciona horário para evitar problemas de timezone
        const formattedDate = date.toLocaleDateString('pt-BR');
        document.getElementById('displayDate').textContent = `Data: ${formattedDate}`;
    }
}

function downloadCertificate() {
    const certificate = document.getElementById('certificate');
    
    // Verificar se html2canvas está disponível
    if (typeof html2canvas === 'undefined') {
        alert('Biblioteca html2canvas não carregada. Verifique sua conexão com a internet.');
        return;
    }
    
    // Usar html2canvas para capturar o certificado
    html2canvas(certificate, {
        scale: 2,
        backgroundColor: '#ffffff',
        width: 800,
        height: 600,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        const link = document.createElement('a');
        const participantName = document.getElementById('participantName').value || 'participante';
        link.download = `certificado_${participantName.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(error => {
        console.error('Erro ao gerar certificado:', error);
        alert('Erro ao gerar certificado. Tente novamente.');
    });
}

// Atualizar em tempo real conforme o usuário digita
document.addEventListener('input', function(e) {
    if (e.target.matches('input, textarea, select')) {
        updateCertificate();
    }
});

// Atualizar certificado na inicialização
document.addEventListener('DOMContentLoaded', function() {
    updateCertificate();
});