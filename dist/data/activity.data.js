"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityData = void 0;
const models_1 = require("../models");
exports.ActivityData = {
    findAll(where = {}) {
        return models_1.Activity.findAll({ where, order: [['nom', 'ASC']] });
    },
    findByPk(id) {
        return models_1.Activity.findByPk(id);
    },
    findBySlug(slug) {
        return models_1.Activity.findOne({ where: { slug } });
    },
    create(values) {
        return models_1.Activity.create(values);
    },
    update(id, values) {
        return models_1.Activity.update(values, { where: { id } });
    },
};
