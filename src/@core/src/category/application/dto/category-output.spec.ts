import Category from "../../domain/entities/category"
import { CategoryOutputMapper } from "./category-output.dto"

describe('CategoryOutputMapper test', () => {
    it('should convert a category in output', () => {
        const created_at = new Date()
        const category = new Category({name: 'N1',description: 'D1', is_active: true, created_at: created_at})

        const out = CategoryOutputMapper.toCategoryItemOutput(category)
        expect(out).toStrictEqual({
            id: category.id,
            name: 'N1',
            description: 'D1',
            is_active: true,
            created_at: created_at
        })
    })
})