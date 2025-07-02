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
    
    // Temporariamente remover o transform scale para captura em tamanho real
    const originalTransform = certificate.style.transform;
    certificate.style.transform = 'scale(1)';
    certificate.style.transformOrigin = 'top left';
    
    // Usar html2canvas para capturar o certificado em alta resolução
    html2canvas(certificate, {
        scale: 3, // Alta resolução
        backgroundColor: '#ffffff',
        width: 800,
        height: 600,
        useCORS: true,
        allowTaint: true
    }).then(canvas => {
        // Restaurar o transform original
        certificate.style.transform = originalTransform;
        certificate.style.transformOrigin = 'top center';
        
        const participantName = document.getElementById('participantName').value || 'participante';
        
        // Tentar gerar PDF se jsPDF estiver disponível
        if (typeof window.jspdf !== 'undefined') {
        try {
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = 297;
            const pdfHeight = 210;

            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583));

            const finalWidth = imgWidth * 0.264583 * ratio;
            const finalHeight = imgHeight * 0.264583 * ratio;

            const x = (pdfWidth - finalWidth) / 2;
            const y = (pdfHeight - finalHeight) / 2;

            pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', x, y, finalWidth, finalHeight);

            pdf.save(`certificado_${participantName.replace(/\s+/g, '_')}.pdf`);
            return;
        } catch (error) {
            console.warn('Erro ao gerar PDF, baixando como PNG:', error);
        }
    }

        
        // Fallback: baixar como PNG em alta qualidade se PDF não funcionar
        const link = document.createElement('a');
        link.download = `certificado_${participantName.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
        
    }).catch(error => {
        // Restaurar o transform original em caso de erro
        certificate.style.transform = originalTransform;
        certificate.style.transformOrigin = 'top center';
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