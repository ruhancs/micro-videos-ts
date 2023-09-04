import { CastMember, CastMemberType } from "#cast-member/domain/entities/cast-member";
import { CastMemberFilter, CastMemberRepository } from "#cast-member/domain/repository/cast-member.repository";
import { InMemorySearchableRepository } from "#seedwork/domain";


export class CastMemberInMemoryRepository 
    extends InMemorySearchableRepository<CastMember>
    implements CastMemberRepository{
        
        sortableFields: string[] = ['name', 'create_at'];
        
        protected async applyFilter(items: CastMember[], filter: CastMemberFilter): Promise<CastMember[]> {
            if(!filter){
                return items;
            }
            if(filter === 'actor' || filter === 'director'){
                if(filter === 'actor') {
                    return items.filter((i) => i.type===CastMemberType.ACTOR)
                }
                if(filter === 'director') {
                    return items.filter((i) => i.type===CastMemberType.DIRECTOR)
                }
            }
            return items.filter((i) => {
                return (i.props.name.toLowerCase().includes(filter.toLowerCase())) 
            })
        }
    }