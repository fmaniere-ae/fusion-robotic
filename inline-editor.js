// Éditeur inline sécurisé pour Fusion Robotic
class SecureInlineEditor {
    constructor() {
        this.originalData = null;
        this.currentData = null;
        this.editMode = false;
        this.changes = [];
        this.history = [];
    }

    // Initialiser l'éditeur
    async init() {
        // Vérifier si mode édition est activé
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('edit') !== 'true') {
            return; // Mode normal, pas d'édition
        }

        try {
            // Charger les données
            const response = await fetch('/content/home.json');
            this.originalData = await response.json();
            this.currentData = JSON.parse(JSON.stringify(this.originalData)); // Clone profond

            this.editMode = true;
            this.createEditorUI();
            this.makeContentEditable();

            console.log('✏️ Mode édition activé');
        } catch (error) {
            console.error('Erreur lors du chargement:', error);
            alert('Impossible de charger le fichier de contenu.');
        }
    }

    // Créer l'interface de l'éditeur
    createEditorUI() {
        const editorPanel = document.createElement('div');
        editorPanel.id = 'editor-panel';
        editorPanel.innerHTML = `
      <style>
        #editor-panel {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 20px;
          z-index: 10000;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        #editor-panel .container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
        }
        #editor-panel h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
        }
        #editor-panel .buttons {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        #editor-panel button {
          padding: 10px 20px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
        }
        #editor-panel button:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .btn-save { background: #10b981; color: white; }
        .btn-cancel { background: #ef4444; color: white; }
        .btn-preview { background: #f59e0b; color: white; }
        .btn-history { background: #3b82f6; color: white; }
        .btn-help { background: #8b5cf6; color: white; }
        
        .editable-content {
          outline: 2px dashed transparent;
          transition: all 0.3s;
          cursor: text;
          padding: 4px;
          border-radius: 4px;
        }
        .editable-content:hover {
          outline-color: #667eea;
          background: rgba(102, 126, 234, 0.05);
        }
        .editable-content:focus {
          outline-color: #10b981;
          background: rgba(16, 185, 129, 0.05);
        }
        
        .changes-indicator {
          background: #f59e0b;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
        
        #modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.7);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        #modal-content {
          background: white;
          padding: 30px;
          border-radius: 12px;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          color: #1f2937;
        }
        #modal-content h3 {
          margin-top: 0;
          color: #667eea;
        }
        #modal-content button {
          margin-top: 20px;
        }
        
        body.edit-mode {
          padding-top: 80px;
        }
      </style>
      
      <div class="container">
        <div>
          <h3>✏️ Mode Édition</h3>
          <p style="margin: 5px 0 0 0; font-size: 12px; opacity: 0.9;">
            Cliquez sur n'importe quel texte pour le modifier
          </p>
        </div>
        <div class="buttons">
          <span class="changes-indicator" id="changes-count">0 modification(s)</span>
          <button class="btn-help" onclick="editor.showHelp()">❓ Aide</button>
          <button class="btn-history" onclick="editor.showHistory()">📋 Historique</button>
          <button class="btn-preview" onclick="editor.preview()">👁️ Aperçu</button>
          <button class="btn-cancel" onclick="editor.cancel()">❌ Annuler tout</button>
          <button class="btn-save" onclick="editor.save()">💾 Sauvegarder</button>
        </div>
      </div>
    `;

        document.body.insertBefore(editorPanel, document.body.firstChild);
        document.body.classList.add('edit-mode');
    }

    // Rendre le contenu éditable
    makeContentEditable() {
        // Mapper les éléments HTML aux chemins JSON
        const editableMap = [
            { selector: 'h1 .gradient-text', path: 'hero.title_line1' },
            { selector: 'h1 .text-gray-900', path: 'hero.title_line2' },
            { selector: '.text-xl.md\\:text-2xl.text-gray-600.mb-8', path: 'hero.subtitle' },
            { selector: '#qui-sommes-nous .text-fusion-blue', path: 'about.association_title' },
            { selector: '#qui-sommes-nous .text-fusion-cyan', path: 'about.atelier_title' },
            // Ajoutez d'autres mappings selon vos besoins
        ];

        editableMap.forEach(item => {
            const element = document.querySelector(item.selector);
            if (element) {
                element.classList.add('editable-content');
                element.contentEditable = true;
                element.dataset.jsonPath = item.path;

                // Écouter les modifications
                element.addEventListener('blur', (e) => this.onContentChange(e));
                element.addEventListener('input', () => this.updateChangesCount());
            }
        });
    }

    // Quand un contenu est modifié
    onContentChange(event) {
        const element = event.target;
        const path = element.dataset.jsonPath;
        const newValue = element.textContent.trim();

        // Mettre à jour les données
        this.setNestedValue(this.currentData, path, newValue);

        // Enregistrer la modification
        this.changes.push({
            path: path,
            oldValue: this.getNestedValue(this.originalData, path),
            newValue: newValue,
            timestamp: new Date().toISOString()
        });

        this.updateChangesCount();
    }

    // Compter les modifications
    updateChangesCount() {
        const count = this.changes.length;
        document.getElementById('changes-count').textContent = `${count} modification(s)`;
    }

    // Annuler toutes les modifications
    cancel() {
        if (this.changes.length === 0) {
            alert('Aucune modification à annuler.');
            return;
        }

        if (confirm('⚠️ Êtes-vous sûr de vouloir annuler toutes les modifications ?')) {
            location.reload();
        }
    }

    // Prévisualiser les changements
    preview() {
        const modal = this.createModal('Aperçu des modifications', `
      <div style="max-height: 400px; overflow-y: auto;">
        ${this.changes.length === 0 ?
                '<p>Aucune modification pour le moment.</p>' :
                this.changes.map((change, i) => `
            <div style="padding: 10px; border-left: 3px solid #667eea; margin-bottom: 10px; background: #f3f4f6;">
              <strong>Modification ${i + 1}</strong><br>
              <small style="color: #6b7280;">${change.path}</small><br>
              <div style="margin-top: 8px;">
                <span style="color: #ef4444;">❌ Avant:</span> ${change.oldValue}<br>
                <span style="color: #10b981;">✅ Après:</span> ${change.newValue}
              </div>
            </div>
          `).join('')
            }
      </div>
      <button class="btn-cancel" onclick="editor.closeModal()">Fermer</button>
    `);
    }

    // Afficher l'historique
    showHistory() {
        // Vérifier si localStorage contient des sauvegardes
        const backups = this.getBackups();

        const modal = this.createModal('📋 Historique des sauvegardes', `
      <div style="max-height: 400px; overflow-y: auto;">
        ${backups.length === 0 ?
                '<p>Aucune sauvegarde disponible.</p>' :
                backups.map((backup, i) => `
            <div style="padding: 10px; border: 1px solid #e5e7eb; margin-bottom: 10px; border-radius: 8px;">
              <strong>Sauvegarde ${i + 1}</strong><br>
              <small>${new Date(backup.timestamp).toLocaleString('fr-FR')}</small><br>
              <button onclick="editor.restoreBackup(${i})" style="margin-top: 8px; padding: 6px 12px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer;">
                🔄 Restaurer cette version
              </button>
            </div>
          `).join('')
            }
      </div>
      <button class="btn-cancel" onclick="editor.closeModal()">Fermer</button>
    `);
    }

    // Afficher l'aide
    showHelp() {
        const modal = this.createModal('❓ Guide d\'utilisation', `
      <h4>Comment utiliser l'éditeur ?</h4>
      <ol style="line-height: 1.8;">
        <li><strong>Modifier un texte :</strong> Cliquez sur n'importe quel texte surligné et tapez votre nouveau contenu</li>
        <li><strong>Aperçu :</strong> Cliquez sur "👁️ Aperçu" pour voir toutes vos modifications</li>
        <li><strong>Annuler :</strong> Cliquez sur "❌ Annuler tout" pour recommencer (recharge la page)</li>
        <li><strong>Sauvegarder :</strong> Cliquez sur "💾 Sauvegarder" pour télécharger le nouveau fichier JSON</li>
      </ol>
      
      <h4>Sécurité</h4>
      <ul style="line-height: 1.8;">
        <li>✅ Le HTML n'est jamais modifié, seulement le JSON</li>
        <li>✅ Chaque sauvegarde crée une copie de sécurité</li>
        <li>✅ Vous pouvez restaurer une ancienne version depuis l'historique</li>
        <li>✅ Annuler tout recharge simplement la page</li>
      </ul>
      
      <h4>Après la sauvegarde</h4>
      <p>1. Un fichier <code>home.json</code> sera téléchargé<br>
      2. Remplacez l'ancien fichier dans <code>content/home.json</code><br>
      3. Uploadez sur Netlify ou votre hébergeur<br>
      4. C'est tout ! 🎉</p>
      
      <button class="btn-cancel" onclick="editor.closeModal()">Fermer</button>
    `);
    }

    // Sauvegarder les modifications
    save() {
        if (this.changes.length === 0) {
            alert('Aucune modification à sauvegarder.');
            return;
        }

        const confirmMsg = `Voulez-vous sauvegarder ${this.changes.length} modification(s) ?\n\nUn fichier home.json sera téléchargé.`;

        if (!confirm(confirmMsg)) {
            return;
        }

        // Créer une sauvegarde dans localStorage
        this.createBackup();

        // Télécharger le JSON
        const dataStr = JSON.stringify(this.currentData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `home.json`;
        link.click();

        URL.revokeObjectURL(url);

        alert('✅ Fichier téléchargé !\n\nRemplacez content/home.json par ce fichier et uploadez-le sur votre serveur.');
    }

    // Créer une sauvegarde dans localStorage
    createBackup() {
        const backups = this.getBackups();
        backups.unshift({
            timestamp: new Date().toISOString(),
            data: this.currentData,
            changes: this.changes
        });

        // Garder seulement les 10 dernières sauvegardes
        if (backups.length > 10) {
            backups.pop();
        }

        localStorage.setItem('fusion_backups', JSON.stringify(backups));
    }

    // Récupérer les sauvegardes
    getBackups() {
        const stored = localStorage.getItem('fusion_backups');
        return stored ? JSON.parse(stored) : [];
    }

    // Restaurer une sauvegarde
    restoreBackup(index) {
        const backups = this.getBackups();
        if (!backups[index]) {
            alert('Sauvegarde introuvable.');
            return;
        }

        if (confirm('Restaurer cette version ? Les modifications actuelles seront perdues.')) {
            const backup = backups[index];

            // Télécharger la sauvegarde
            const dataStr = JSON.stringify(backup.data, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);

            const link = document.createElement('a');
            link.href = url;
            link.download = `home-restored-${Date.now()}.json`;
            link.click();

            URL.revokeObjectURL(url);
            this.closeModal();

            alert('✅ Version restaurée et téléchargée !\n\nRemplacez content/home.json par ce fichier.');
        }
    }

    // Créer un modal
    createModal(title, content) {
        const existing = document.getElementById('modal-overlay');
        if (existing) existing.remove();

        const modal = document.createElement('div');
        modal.id = 'modal-overlay';
        modal.innerHTML = `
      <div id="modal-content">
        <h3>${title}</h3>
        ${content}
      </div>
    `;

        document.body.appendChild(modal);

        // Fermer en cliquant à l'extérieur
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });
    }

    closeModal() {
        const modal = document.getElementById('modal-overlay');
        if (modal) modal.remove();
    }

    // Utilitaires pour les objets imbriqués
    getNestedValue(obj, path) {
        return path.split('.').reduce((o, p) => o?.[p], obj);
    }

    setNestedValue(obj, path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((o, k) => o[k] = o[k] || {}, obj);
        target[lastKey] = value;
    }
}

// Initialiser l'éditeur
const editor = new SecureInlineEditor();
editor.init();