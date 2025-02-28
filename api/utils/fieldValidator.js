class FieldValidator {
    /**
     * Verifica se todos os campos obrigatórios estão presentes no objeto fornecido.
     * 
     * @param {Object} availableFields - Objeto com os campos disponíveis.
     * @param {string[]} requiredFields - Lista de campos obrigatórios.
     * @returns {boolean} `true` se todos os campos obrigatórios estiverem presentes, caso contrário, `false`.
     */
    static validate(availableFields, requiredFields) {
        return requiredFields.every(field => Object.prototype.hasOwnProperty.call(availableFields, field));
    }
}

module.exports = FieldValidator;
