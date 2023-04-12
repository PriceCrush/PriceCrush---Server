"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryImage = void 0;
const product_category_entity_1 = require("../../product-category/entities/product-category.entity");
const typeorm_1 = require("typeorm");
let CategoryImage = class CategoryImage {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CategoryImage.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '' }),
    __metadata("design:type", String)
], CategoryImage.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => product_category_entity_1.ProductCategory),
    __metadata("design:type", product_category_entity_1.ProductCategory)
], CategoryImage.prototype, "productCategory", void 0);
CategoryImage = __decorate([
    (0, typeorm_1.Entity)()
], CategoryImage);
exports.CategoryImage = CategoryImage;
//# sourceMappingURL=categoryImage.entity.js.map