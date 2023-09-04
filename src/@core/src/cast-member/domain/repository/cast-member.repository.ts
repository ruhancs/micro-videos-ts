import { SearchParams, SearchResult, SearchableRepositoryInterface } from "#seedwork/domain";
import { CastMember } from "../entities/cast-member";

export type CastMemberFilter = string;

export class CastMemberSearchParams extends SearchParams<CastMemberFilter>{}

export class CastMemberSearchResult extends SearchResult<CastMember, CastMemberFilter>{}

export interface CastMemberRepository extends SearchableRepositoryInterface<CastMember, CastMemberFilter, CastMemberSearchParams, CastMemberSearchResult>{}