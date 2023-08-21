import { deepFreeze } from "./object"

describe('Object unit test', () => {
    it('should not freeze a scalar value', () => {
        const str = deepFreeze('a');
        expect(typeof str).toBe('string')
       
        const bool = deepFreeze(true);
        expect(typeof bool).toBe('boolean')
        
        const number = deepFreeze(5);
        expect(typeof number).toBe('number')

    })
    
    it('should be a imutable obj', () => {
        const obj = deepFreeze({prop1: 'value1', deep: {prop2: 'value2'}});
        expect(() => (obj as any).prop1 = 'not change').toThrow()        
        expect(() => (obj as any).deep.prop2 = 'not change').toThrow()        
        expect(typeof obj.deep.prop2).toBe('string')        
    })
})