import { CastMember, CastMemberType } from "#cast-member/domain/entities/cast-member"
import { CastMemberRepository, CastMemberSearchParams, CastMemberSearchResult } from "#cast-member/domain/repository/cast-member.repository"
import { EntityValidationError, LoadEntityError, NotFoundError, SortDirection, UniqueEntityId } from "#seedwork/domain"
import { SequelizeModelFactory } from "#seedwork/infra"
import { Op, literal } from "sequelize"
import { Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript"

export namespace CastMemberSequelize {
    type CastMemberModelProps = {
        id: string
        name: string
        type: number
        created_at: Date
    }

    @Table({tableName: 'cast_members', timestamps: false})
    export class CastMemberModel extends Model<CastMemberModel> {
        @PrimaryKey
        @Column({type: DataType.UUID})
        declare id: string;
        
        @Column({allowNull: false, type: DataType.STRING(255)})
        declare name: string;
       
        @Column({allowNull: false, type: DataType.DECIMAL})
        declare type: number;
       
        @Column({allowNull: true, type: DataType.DATE})
        declare created_at: Date;

        static factory() {
            const chance: Chance.Chance = require('chance')()
            return new SequelizeModelFactory<CastMemberModel, CastMemberModelProps>(CastMemberModel, () => ({
                id: chance.guid(),
                name: chance.word(),
                type: CastMemberType.ACTOR,
                created_at: chance.date()
            }))
        }
    }

    export class Repository implements CastMemberRepository {
        sortableFields: string[] = ['name', 'created_at'];

        orderBy = {
            mysql: {
                name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`)
            }
        }

        constructor(private castMemberModel: typeof CastMemberModel) {}
        async search(props: CastMemberSearchParams): Promise<CastMemberSearchResult> {
            const offset = (props.page -1) * props.per_page
            const limit = props.per_page
            const {rows:models, count} = await this.castMemberModel.findAndCountAll({
                ...( props.filter && { 
                    where: {name: { [Op.like]: `%${props.filter}%` }},
                }),
                //se sort e sort_dir nao existir ordena por asc name
                ...(props.sort && this.sortableFields.includes(props.sort) 
                    //? {order: [[props.sort,props.sort_dir]]}
                    ? {order: this.formatSort(props.sort,props.sort_dir)}
                    : {order: [['name', 'asc']]}),
                offset,
                limit
            })
            return new CastMemberSearchResult({
                items: models.map((m) => CastMemberModelMapper.toEntity(m)),
                current_page: props.page,
                per_page: props.per_page,
                total: count,
                filter: props.filter,
                sort: props.sort,
                sort_dir: props.sort_dir
            })
        }
        async insert(entity: CastMember): Promise<void> {
            await this.castMemberModel.create(entity.toJSON())
        }
        async findById(id: string | UniqueEntityId): Promise<CastMember> {
            const _id = `${id}`
            const model = await this._get(_id)
            return CastMemberModelMapper.toEntity(model)
        }
        async findAll(): Promise<CastMember[]> {
            const models = await this.castMemberModel.findAll()
            return models.map((m) => CastMemberModelMapper.toEntity(m))
        }
        async update(entity: CastMember): Promise<void> {
            const _id = `${entity.id}`
            await this._get(_id)
            await this.castMemberModel.update(entity.toJSON(), {
                where: {id: _id}
            })
        }
        async delete(id: string | UniqueEntityId): Promise<void> {
            const _id = `${id}`
            await this._get(_id)
            await this.castMemberModel.destroy({where:{id:_id}})
        }

        async bulkInsert(entities: CastMember[]): Promise<void> {
            await this.castMemberModel.bulkCreate(entities.map((e) => e.toJSON()))
        }

        private formatSort(sort: string, sort_dir: SortDirection) {
            const dialect = this.castMemberModel.sequelize.getDialect()
            if(this.orderBy[dialect] && this.orderBy[dialect][sort]) {
                return this.orderBy[dialect][sort](sort_dir)
            }
            return [[sort, sort_dir]]
        }
        
        private async _get(id: string): Promise<CastMemberModel> {
            return  this.castMemberModel.findByPk(id, {rejectOnEmpty: new NotFoundError(`Entity not found with this id: ${id}`)})
        }
    
    }


    export class CastMemberModelMapper{
        static toEntity(model: CastMemberModel) {
            const {id, ...otherdata} = model.toJSON()
            try {
                return new CastMember(otherdata, new UniqueEntityId(id))
            } catch (error) {
                if(error instanceof EntityValidationError) {
                    throw new LoadEntityError(error.error)
                }
                throw error
            }
        }
    }
}