// Fonction pour charger et injecter le contenu depuis le JSON
async function loadContent() {
    try {
        const response = await fetch('/content/home.json');
        const data = await response.json();

        // HERO SECTION
        document.querySelector('.inline-flex.items-center span').textContent = data.hero.badge;
        document.querySelector('h1 .gradient-text').textContent = data.hero.title_line1;
        document.querySelector('h1 .text-gray-900').textContent = data.hero.title_line2;
        document.querySelector('.text-xl.md\\:text-2xl.text-gray-600.mb-8').textContent = data.hero.subtitle;
        document.querySelector('.text-gray-500.italic.mb-8').textContent = data.hero.tagline;

        // Stats hero
        const stats = document.querySelectorAll('.grid.grid-cols-3 .text-center');
        stats[0].querySelector('.font-heading.text-4xl').textContent = data.hero.stats.age;
        stats[0].querySelector('.text-gray-600').textContent = data.hero.stats.age_label;
        stats[1].querySelector('.font-heading.text-4xl').textContent = data.hero.stats.frequency;
        stats[1].querySelector('.text-gray-600').textContent = data.hero.stats.frequency_label;
        stats[2].querySelector('.font-heading.text-4xl').textContent = data.hero.stats.stat3;
        stats[2].querySelector('.text-gray-600').textContent = data.hero.stats.stat3_label;

        // QUI SOMMES-NOUS
        const aboutSection = document.querySelector('#qui-sommes-nous');
        aboutSection.querySelector('.text-fusion-blue').textContent = data.about.association_title;
        aboutSection.querySelectorAll('.text-lg.text-gray-700')[0].textContent = data.about.association_description;
        aboutSection.querySelector('.text-fusion-cyan').textContent = data.about.atelier_title;
        aboutSection.querySelectorAll('.text-lg.text-gray-700')[1].innerHTML = data.about.atelier_description_p1;
        aboutSection.querySelectorAll('.text-lg.text-gray-700')[2].textContent = data.about.atelier_description_p2;

        // Vision
        const visionBox = aboutSection.querySelector('.bg-gradient-to-br.from-fusion-yellow\\/10');
        visionBox.querySelector('h3').textContent = data.about.vision_title;
        visionBox.querySelector('.text-lg.text-center.mb-8').innerHTML = data.about.vision_intro;

        // Vision points
        const visionPoints = visionBox.querySelectorAll('.flex.items-start.space-x-3 p');
        data.about.vision_points.forEach((point, index) => {
            if (visionPoints[index]) {
                visionPoints[index].textContent = point;
            }
        });

        // POURQUOI INSCRIRE
        const whySection = document.querySelector('#pourquoi-inscrire');
        whySection.querySelector('h2 .gradient-text').textContent = data.why_register.title;
        whySection.querySelector('.text-xl.text-gray-600').textContent = data.why_register.subtitle;

        // Benefits cards
        const benefitCards = whySection.querySelectorAll('.grid.sm\\:grid-cols-2 > div');
        data.why_register.benefits.forEach((benefit, index) => {
            if (benefitCards[index]) {
                benefitCards[index].querySelector('.text-5xl').textContent = benefit.icon;
                benefitCards[index].querySelector('h3').textContent = benefit.title;
                benefitCards[index].querySelector('p').textContent = benefit.description;
            }
        });

        // PROGRAMME
        const programSection = document.querySelector('#programme');
        programSection.querySelector('h2 .gradient-text').textContent = data.program.title;

        // Boutons tabs
        document.querySelector('#btn-beginners').innerHTML = data.program.beginners.tab_label;
        document.querySelector('#btn-advanced').innerHTML = data.program.advanced.tab_label;

        // Programme Débutants
        const beginnersDiv = document.querySelector('#level-beginners');
        beginnersDiv.querySelector('h3').textContent = data.program.beginners.learning_path_title;
        beginnersDiv.querySelector('.text-gray-700.mb-6').textContent = data.program.beginners.learning_path_description;

        const beginnersSteps = beginnersDiv.querySelectorAll('.space-y-3 .flex.items-start p');
        data.program.beginners.learning_steps.forEach((step, index) => {
            if (beginnersSteps[index]) {
                beginnersSteps[index].textContent = step;
            }
        });

        beginnersDiv.querySelectorAll('.space-y-6 h3')[0].textContent = data.program.beginners.projects_title;
        const beginnersProjects = beginnersDiv.querySelectorAll('.space-y-6 > div.bg-white');
        data.program.beginners.projects.forEach((project, index) => {
            if (beginnersProjects[index]) {
                beginnersProjects[index].querySelector('h4').textContent = project.title;
                beginnersProjects[index].querySelector('p').textContent = project.description;
            }
        });

        // Programme Avancés
        const advancedDiv = document.querySelector('#level-advanced');
        advancedDiv.querySelector('h3').textContent = data.program.advanced.learning_path_title;
        advancedDiv.querySelector('.text-gray-700.mb-6').textContent = data.program.advanced.learning_path_description;

        const advancedSteps = advancedDiv.querySelectorAll('.space-y-3 .flex.items-start p');
        data.program.advanced.learning_steps.forEach((step, index) => {
            if (advancedSteps[index]) {
                advancedSteps[index].textContent = step;
            }
        });

        advancedDiv.querySelectorAll('.space-y-6 h3')[0].textContent = data.program.advanced.projects_title;
        const advancedProjects = advancedDiv.querySelectorAll('.space-y-6 > div.bg-white');
        data.program.advanced.projects.forEach((project, index) => {
            if (advancedProjects[index]) {
                advancedProjects[index].querySelector('h4').textContent = project.title;
                advancedProjects[index].querySelector('p').textContent = project.description;
            }
        });

        // INFOS PRATIQUES
        const infoSection = document.querySelector('#infos-pratiques');
        infoSection.querySelector('h2 .gradient-text').textContent = data.practical_info.title;

        // Organisation
        infoSection.querySelector('.text-fusion-orange').parentElement.querySelector('.text-3xl').textContent = '📅';
        infoSection.querySelector('.text-fusion-orange').textContent = data.practical_info.organization.title;

        const orgItems = infoSection.querySelectorAll('.bg-gradient-to-br.from-fusion-orange\\/10 .flex.items-start .text-gray-700');
        orgItems[0].textContent = data.practical_info.organization.schedule;
        orgItems[1].textContent = data.practical_info.organization.location;
        orgItems[2].textContent = data.practical_info.organization.group_size;
        orgItems[3].textContent = data.practical_info.organization.price;

        // Sécurité
        infoSection.querySelector('.text-fusion-red').textContent = data.practical_info.safety.title;
        const safetyItems = infoSection.querySelectorAll('.bg-gradient-to-br.from-fusion-red\\/10 li span.text-gray-700');
        data.practical_info.safety.points.forEach((point, index) => {
            if (safetyItems[index]) {
                safetyItems[index].textContent = point;
            }
        });

        // Matériel
        infoSection.querySelector('.text-fusion-purple').textContent = data.practical_info.equipment.title;
        const equipmentItems = infoSection.querySelectorAll('.bg-gradient-to-br.from-fusion-purple\\/10 li span.text-gray-700');
        data.practical_info.equipment.items.forEach((item, index) => {
            if (equipmentItems[index]) {
                equipmentItems[index].textContent = item;
            }
        });

        // CONTACT
        const contactSection = document.querySelector('#contact');
        contactSection.querySelector('h2 .gradient-text').textContent = data.contact.title;
        contactSection.querySelector('.text-xl.text-gray-600').textContent = data.contact.subtitle;

        // Coordonnées
        contactSection.querySelector('a[href^="tel"]').textContent = data.contact.phone;
        contactSection.querySelector('a[href^="tel"]').href = `tel:${data.contact.phone.replace(/\s/g, '')}`;
        // contactSection.querySelector('a[href^="mailto"]').textContent = data.contact.email;
        // contactSection.querySelector('a[href^="mailto"]').href = `mailto:${data.contact.email}`;
        contactSection.querySelectorAll('.text-gray-700')[0].innerHTML = data.contact.address.replace(/\n/g, '<br>');

        // Form placeholders
        contactSection.querySelector('input[name="name"]').placeholder = data.contact.form.name_placeholder;
        contactSection.querySelector('input[name="email"]').placeholder = data.contact.form.email_placeholder;
        contactSection.querySelector('textarea[name="message"]').placeholder = data.contact.form.message_placeholder;
        contactSection.querySelector('button[type="submit"]').textContent = data.contact.form.submit_button;

        // FOOTER
        const footer = document.querySelector('footer');
        footer.querySelectorAll('.text-gray-400')[0].textContent = data.footer.tagline;
        footer.querySelectorAll('.text-gray-400')[1].textContent = data.footer.description;
        footer.querySelector('.text-center.text-gray-400.text-sm p').textContent = data.footer.copyright;

        console.log('✅ Contenu chargé avec succès !');

    } catch (error) {
        console.error('❌ Erreur lors du chargement du contenu:', error);
    }
}

// Charger le contenu dès que le DOM est prêt
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadContent);
} else {
    loadContent();
}