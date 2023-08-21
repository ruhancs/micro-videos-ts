import ValueObject from "../value-object";

class StubValueObject extends ValueObject{

}

describe('Value Object unique tests', () => {
    it('should set value', () => {
        let vo = new StubValueObject('string value')
        expect(vo.value).toBe('string value');
        
        vo = new StubValueObject({prop1: 'value1'})
        expect(vo.value).toStrictEqual({prop1: 'value1'});
    })

    it('should convert value object to string', () => {
        let vo = new StubValueObject({prop1: 'value1'})
        expect(vo+'').toBe("{\"prop1\":\"value1\"}")
        
        vo = new StubValueObject(true)
        expect(vo+'').toBe('true')
       
        vo = new StubValueObject(1)
        expect(vo+'').toBe('1')
    })
})