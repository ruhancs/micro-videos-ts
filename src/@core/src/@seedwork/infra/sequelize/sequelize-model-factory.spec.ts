import { Column, DataType, Model, PrimaryKey, Sequelize, Table } from "sequelize-typescript";
import { SequelizeModelFactory } from "./sequelize-model.factory";
import {validate as uuidValidate} from 'uuid'
import { setupSequelize } from "../testing/helpers/db";
const chance: Chance.Chance = require('chance')();

@Table({})
class StubModel extends Model {
    @PrimaryKey
    @Column({type: DataType.UUID})
    declare id: string

    @Column({allowNull: false, type: DataType.STRING(255)})
    declare name: string

    static factory() {
        return new SequelizeModelFactory<StubModel>(StubModel, () => ({
            id: chance.guid(),
            name: chance.word(),
        }))
    }
}

describe('SequelizeModelFactory tests', () => {
    setupSequelize({models: [StubModel]})

    it('should create a model', async() => {
        let model = await StubModel.factory().create()
        expect(uuidValidate(model.id)).toBeTruthy()
        expect(model.name).not.toBe(null)

        let modelFound = await StubModel.findByPk(model.id)
        expect(modelFound.id).toBe(model.id)

        model = await StubModel.factory().create({
            id: '77349e57-d8cf-47cf-991e-8f1b62efad1b',
            name: 'N1'
        })
        expect(model.id).toBe('77349e57-d8cf-47cf-991e-8f1b62efad1b')
        expect(model.name).toBe('N1')

        modelFound = await StubModel.findByPk(model.id)
        expect(modelFound.id).toBe(model.id)
    })
    
    it('should test method make of SequelizeFactory', async() => {
        let model = StubModel.factory().make()
        expect(uuidValidate(model.id)).toBeTruthy()
        expect(model.id).not.toBe(null)
        expect(model.name).not.toBe(null)

        model = StubModel.factory().make({
            id: '77349e57-d8cf-47cf-991e-8f1b62efad1b',
            name: 'N1'
        })
        expect(model.id).toBe('77349e57-d8cf-47cf-991e-8f1b62efad1b')
        expect(model.name).toBe('N1')
    })

    it('should test bulkCreate method with default count value', async() => {
        let models = await StubModel.factory().bulkCreate()

        expect(models.length).toBe(1)
        expect(models[0].id).not.toBe(null)
        expect(models[0].name).not.toBe(null)

        let modelFound = await StubModel.findByPk(models[0].id)
        expect(modelFound.id).toBe(models[0].id)
        expect(modelFound.name).toBe(models[0].name)

        models = await StubModel.factory().bulkCreate(() => ({
            id: '77349e57-d8cf-47cf-991e-8f1b62efad1b',
            name: 'N1'
        }))
        expect(models[0].id).toBe('77349e57-d8cf-47cf-991e-8f1b62efad1b')
        expect(models[0].name).toBe('N1')
    })
    
    it('should test bulkCreate method with param count > 1', async() => {
        let models = await StubModel.factory().count(2).bulkCreate()

        expect(models.length).toBe(2)
        expect(models[0].id).not.toBe(null)
        expect(models[0].name).not.toBe(null)
        expect(models[1].id).not.toBe(null)
        expect(models[1].name).not.toBe(null)

        let modelFound = await StubModel.findByPk(models[0].id)
        expect(modelFound.id).toBe(models[0].id)
        expect(modelFound.name).toBe(models[0].name)
        
        modelFound = await StubModel.findByPk(models[1].id)
        expect(modelFound.id).toBe(models[1].id)
        expect(modelFound.name).toBe(models[1].name)

        models = await StubModel.factory().count(2).bulkCreate(() => ({
            id: chance.guid(),
            name: 'test'
        }))
        expect(models[0].id).not.toBe(null)
        expect(models[0].name).not.toBe(null)
        expect(models[0].id).not.toBe(models[1].id)
    })

    it('should test bulkMake method with default count value', async() => {
        let models = StubModel.factory().bulkMake()

        expect(models.length).toBe(1)
        expect(models[0].id).not.toBe(null)
        expect(models[0].name).not.toBe(null)

        models = StubModel.factory().bulkMake(() => ({
            id: '77349e57-d8cf-47cf-991e-8f1b62efad1b',
            name: 'N1'
        }))
        expect(models[0].id).toBe('77349e57-d8cf-47cf-991e-8f1b62efad1b')
        expect(models[0].name).toBe('N1')
    })
    
    it('should test bulkMake method with param count > 1', async() => {
        let models = StubModel.factory().count(2).bulkMake()

        expect(models.length).toBe(2)
        expect(models[0].id).not.toBe(null)
        expect(models[0].name).not.toBe(null)
        expect(models[1].id).not.toBe(null)
        expect(models[1].name).not.toBe(null)

        models = StubModel.factory().count(2).bulkMake(() => ({
            id: chance.guid(),
            name: 'test'
        }))
        expect(models[0].id).not.toBe(null)
        expect(models[0].name).not.toBe(null)
        expect(models[0].id).not.toBe(models[1].id)
    })
})