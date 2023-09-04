import { setupSequelize } from "#seedwork/infra"
import { CastMemberSequelize } from "../cast-member-sequelize"

describe('CastMemberModel test', () => {
    setupSequelize({models: [CastMemberSequelize.CastMemberModel]})

    it('should test mapping props',() => {
        const attrMap = CastMemberSequelize.CastMemberModel.getAttributes()
        const attr = Object.keys(attrMap)

        expect(attr).toStrictEqual(['id', 'name', 'type', 'created_at'])
    })
})