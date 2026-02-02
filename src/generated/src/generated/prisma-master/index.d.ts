
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Tenant
 * 
 */
export type Tenant = $Result.DefaultSelection<Prisma.$TenantPayload>
/**
 * Model PaymentRecord
 * 
 */
export type PaymentRecord = $Result.DefaultSelection<Prisma.$PaymentRecordPayload>
/**
 * Model SuperAdmin
 * 
 */
export type SuperAdmin = $Result.DefaultSelection<Prisma.$SuperAdminPayload>
/**
 * Model TenantActivityLog
 * 
 */
export type TenantActivityLog = $Result.DefaultSelection<Prisma.$TenantActivityLogPayload>
/**
 * Model TenantMetrics
 * 
 */
export type TenantMetrics = $Result.DefaultSelection<Prisma.$TenantMetricsPayload>
/**
 * Model TenantUsage
 * 
 */
export type TenantUsage = $Result.DefaultSelection<Prisma.$TenantUsagePayload>
/**
 * Model UsageAlert
 * 
 */
export type UsageAlert = $Result.DefaultSelection<Prisma.$UsageAlertPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const SubscriptionTier: {
  FREE_TRIAL: 'FREE_TRIAL',
  BASIC: 'BASIC',
  STANDARD: 'STANDARD',
  PREMIUM: 'PREMIUM'
};

export type SubscriptionTier = (typeof SubscriptionTier)[keyof typeof SubscriptionTier]


export const SubscriptionStatus: {
  TRIAL: 'TRIAL',
  ACTIVE: 'ACTIVE',
  PAYMENT_DUE: 'PAYMENT_DUE',
  EXPIRED: 'EXPIRED',
  CANCELLED: 'CANCELLED'
};

export type SubscriptionStatus = (typeof SubscriptionStatus)[keyof typeof SubscriptionStatus]


export const TenantStatus: {
  PROVISIONING: 'PROVISIONING',
  ACTIVE: 'ACTIVE',
  SUSPENDED: 'SUSPENDED',
  TRIAL_EXPIRED: 'TRIAL_EXPIRED',
  CANCELLED: 'CANCELLED',
  ARCHIVED: 'ARCHIVED'
};

export type TenantStatus = (typeof TenantStatus)[keyof typeof TenantStatus]


export const SuperAdminRole: {
  SUPER_ADMIN: 'SUPER_ADMIN',
  OPERATOR: 'OPERATOR',
  SUPPORT: 'SUPPORT'
};

export type SuperAdminRole = (typeof SuperAdminRole)[keyof typeof SuperAdminRole]

}

export type SubscriptionTier = $Enums.SubscriptionTier

export const SubscriptionTier: typeof $Enums.SubscriptionTier

export type SubscriptionStatus = $Enums.SubscriptionStatus

export const SubscriptionStatus: typeof $Enums.SubscriptionStatus

export type TenantStatus = $Enums.TenantStatus

export const TenantStatus: typeof $Enums.TenantStatus

export type SuperAdminRole = $Enums.SuperAdminRole

export const SuperAdminRole: typeof $Enums.SuperAdminRole

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Tenants
 * const tenants = await prisma.tenant.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  T extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof T ? T['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<T['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Tenants
   * const tenants = await prisma.tenant.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<T, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<'extends', Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.tenant`: Exposes CRUD operations for the **Tenant** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tenants
    * const tenants = await prisma.tenant.findMany()
    * ```
    */
  get tenant(): Prisma.TenantDelegate<ExtArgs>;

  /**
   * `prisma.paymentRecord`: Exposes CRUD operations for the **PaymentRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PaymentRecords
    * const paymentRecords = await prisma.paymentRecord.findMany()
    * ```
    */
  get paymentRecord(): Prisma.PaymentRecordDelegate<ExtArgs>;

  /**
   * `prisma.superAdmin`: Exposes CRUD operations for the **SuperAdmin** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SuperAdmins
    * const superAdmins = await prisma.superAdmin.findMany()
    * ```
    */
  get superAdmin(): Prisma.SuperAdminDelegate<ExtArgs>;

  /**
   * `prisma.tenantActivityLog`: Exposes CRUD operations for the **TenantActivityLog** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TenantActivityLogs
    * const tenantActivityLogs = await prisma.tenantActivityLog.findMany()
    * ```
    */
  get tenantActivityLog(): Prisma.TenantActivityLogDelegate<ExtArgs>;

  /**
   * `prisma.tenantMetrics`: Exposes CRUD operations for the **TenantMetrics** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TenantMetrics
    * const tenantMetrics = await prisma.tenantMetrics.findMany()
    * ```
    */
  get tenantMetrics(): Prisma.TenantMetricsDelegate<ExtArgs>;

  /**
   * `prisma.tenantUsage`: Exposes CRUD operations for the **TenantUsage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more TenantUsages
    * const tenantUsages = await prisma.tenantUsage.findMany()
    * ```
    */
  get tenantUsage(): Prisma.TenantUsageDelegate<ExtArgs>;

  /**
   * `prisma.usageAlert`: Exposes CRUD operations for the **UsageAlert** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UsageAlerts
    * const usageAlerts = await prisma.usageAlert.findMany()
    * ```
    */
  get usageAlert(): Prisma.UsageAlertDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql

  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.15.0
   * Query Engine version: 12e25d8d06f6ea5a0252864dd9a03b1bb51f3022
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON object.
   * This type can be useful to enforce some input to be JSON-compatible or as a super-type to be extended from. 
   */
  export type JsonObject = {[Key in string]?: JsonValue}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches a JSON array.
   */
  export interface JsonArray extends Array<JsonValue> {}

  /**
   * From https://github.com/sindresorhus/type-fest/
   * Matches any valid JSON value.
   */
  export type JsonValue = string | number | boolean | JsonObject | JsonArray | null

  /**
   * Matches a JSON object.
   * Unlike `JsonObject`, this type allows undefined and read-only properties.
   */
  export type InputJsonObject = {readonly [Key in string]?: InputJsonValue | null}

  /**
   * Matches a JSON array.
   * Unlike `JsonArray`, readonly arrays are assignable to this type.
   */
  export interface InputJsonArray extends ReadonlyArray<InputJsonValue | null> {}

  /**
   * Matches any valid value that can be used as an input for operations like
   * create and update as the value of a JSON field. Unlike `JsonValue`, this
   * type allows read-only arrays and read-only object properties and disallows
   * `null` at the top level.
   *
   * `null` cannot be used as the value of a JSON field because its meaning
   * would be ambiguous. Use `Prisma.JsonNull` to store the JSON null value or
   * `Prisma.DbNull` to clear the JSON value and set the field to the database
   * NULL value instead.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
   */
  export type InputJsonValue = string | number | boolean | InputJsonObject | InputJsonArray | { toJSON(): unknown }

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Tenant: 'Tenant',
    PaymentRecord: 'PaymentRecord',
    SuperAdmin: 'SuperAdmin',
    TenantActivityLog: 'TenantActivityLog',
    TenantMetrics: 'TenantMetrics',
    TenantUsage: 'TenantUsage',
    UsageAlert: 'UsageAlert'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }


  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs}, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    meta: {
      modelProps: 'tenant' | 'paymentRecord' | 'superAdmin' | 'tenantActivityLog' | 'tenantMetrics' | 'tenantUsage' | 'usageAlert'
      txIsolationLevel: Prisma.TransactionIsolationLevel
    },
    model: {
      Tenant: {
        payload: Prisma.$TenantPayload<ExtArgs>
        fields: Prisma.TenantFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findFirst: {
            args: Prisma.TenantFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          findMany: {
            args: Prisma.TenantFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          create: {
            args: Prisma.TenantCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          createMany: {
            args: Prisma.TenantCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>[]
          }
          delete: {
            args: Prisma.TenantDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          update: {
            args: Prisma.TenantUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          deleteMany: {
            args: Prisma.TenantDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.TenantUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantPayload>
          }
          aggregate: {
            args: Prisma.TenantAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateTenant>
          }
          groupBy: {
            args: Prisma.TenantGroupByArgs<ExtArgs>,
            result: $Utils.Optional<TenantGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantCountArgs<ExtArgs>,
            result: $Utils.Optional<TenantCountAggregateOutputType> | number
          }
        }
      }
      PaymentRecord: {
        payload: Prisma.$PaymentRecordPayload<ExtArgs>
        fields: Prisma.PaymentRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PaymentRecordFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PaymentRecordFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload>
          }
          findFirst: {
            args: Prisma.PaymentRecordFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PaymentRecordFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload>
          }
          findMany: {
            args: Prisma.PaymentRecordFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload>[]
          }
          create: {
            args: Prisma.PaymentRecordCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload>
          }
          createMany: {
            args: Prisma.PaymentRecordCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PaymentRecordCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload>[]
          }
          delete: {
            args: Prisma.PaymentRecordDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload>
          }
          update: {
            args: Prisma.PaymentRecordUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload>
          }
          deleteMany: {
            args: Prisma.PaymentRecordDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.PaymentRecordUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.PaymentRecordUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$PaymentRecordPayload>
          }
          aggregate: {
            args: Prisma.PaymentRecordAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregatePaymentRecord>
          }
          groupBy: {
            args: Prisma.PaymentRecordGroupByArgs<ExtArgs>,
            result: $Utils.Optional<PaymentRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.PaymentRecordCountArgs<ExtArgs>,
            result: $Utils.Optional<PaymentRecordCountAggregateOutputType> | number
          }
        }
      }
      SuperAdmin: {
        payload: Prisma.$SuperAdminPayload<ExtArgs>
        fields: Prisma.SuperAdminFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SuperAdminFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SuperAdminFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          findFirst: {
            args: Prisma.SuperAdminFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SuperAdminFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          findMany: {
            args: Prisma.SuperAdminFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>[]
          }
          create: {
            args: Prisma.SuperAdminCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          createMany: {
            args: Prisma.SuperAdminCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SuperAdminCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>[]
          }
          delete: {
            args: Prisma.SuperAdminDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          update: {
            args: Prisma.SuperAdminUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          deleteMany: {
            args: Prisma.SuperAdminDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.SuperAdminUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.SuperAdminUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$SuperAdminPayload>
          }
          aggregate: {
            args: Prisma.SuperAdminAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateSuperAdmin>
          }
          groupBy: {
            args: Prisma.SuperAdminGroupByArgs<ExtArgs>,
            result: $Utils.Optional<SuperAdminGroupByOutputType>[]
          }
          count: {
            args: Prisma.SuperAdminCountArgs<ExtArgs>,
            result: $Utils.Optional<SuperAdminCountAggregateOutputType> | number
          }
        }
      }
      TenantActivityLog: {
        payload: Prisma.$TenantActivityLogPayload<ExtArgs>
        fields: Prisma.TenantActivityLogFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantActivityLogFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantActivityLogPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantActivityLogFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantActivityLogPayload>
          }
          findFirst: {
            args: Prisma.TenantActivityLogFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantActivityLogPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantActivityLogFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantActivityLogPayload>
          }
          findMany: {
            args: Prisma.TenantActivityLogFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantActivityLogPayload>[]
          }
          create: {
            args: Prisma.TenantActivityLogCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantActivityLogPayload>
          }
          createMany: {
            args: Prisma.TenantActivityLogCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantActivityLogCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantActivityLogPayload>[]
          }
          delete: {
            args: Prisma.TenantActivityLogDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantActivityLogPayload>
          }
          update: {
            args: Prisma.TenantActivityLogUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantActivityLogPayload>
          }
          deleteMany: {
            args: Prisma.TenantActivityLogDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.TenantActivityLogUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.TenantActivityLogUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantActivityLogPayload>
          }
          aggregate: {
            args: Prisma.TenantActivityLogAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateTenantActivityLog>
          }
          groupBy: {
            args: Prisma.TenantActivityLogGroupByArgs<ExtArgs>,
            result: $Utils.Optional<TenantActivityLogGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantActivityLogCountArgs<ExtArgs>,
            result: $Utils.Optional<TenantActivityLogCountAggregateOutputType> | number
          }
        }
      }
      TenantMetrics: {
        payload: Prisma.$TenantMetricsPayload<ExtArgs>
        fields: Prisma.TenantMetricsFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantMetricsFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantMetricsPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantMetricsFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantMetricsPayload>
          }
          findFirst: {
            args: Prisma.TenantMetricsFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantMetricsPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantMetricsFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantMetricsPayload>
          }
          findMany: {
            args: Prisma.TenantMetricsFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantMetricsPayload>[]
          }
          create: {
            args: Prisma.TenantMetricsCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantMetricsPayload>
          }
          createMany: {
            args: Prisma.TenantMetricsCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantMetricsCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantMetricsPayload>[]
          }
          delete: {
            args: Prisma.TenantMetricsDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantMetricsPayload>
          }
          update: {
            args: Prisma.TenantMetricsUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantMetricsPayload>
          }
          deleteMany: {
            args: Prisma.TenantMetricsDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.TenantMetricsUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.TenantMetricsUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantMetricsPayload>
          }
          aggregate: {
            args: Prisma.TenantMetricsAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateTenantMetrics>
          }
          groupBy: {
            args: Prisma.TenantMetricsGroupByArgs<ExtArgs>,
            result: $Utils.Optional<TenantMetricsGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantMetricsCountArgs<ExtArgs>,
            result: $Utils.Optional<TenantMetricsCountAggregateOutputType> | number
          }
        }
      }
      TenantUsage: {
        payload: Prisma.$TenantUsagePayload<ExtArgs>
        fields: Prisma.TenantUsageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TenantUsageFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantUsagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TenantUsageFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantUsagePayload>
          }
          findFirst: {
            args: Prisma.TenantUsageFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantUsagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TenantUsageFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantUsagePayload>
          }
          findMany: {
            args: Prisma.TenantUsageFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantUsagePayload>[]
          }
          create: {
            args: Prisma.TenantUsageCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantUsagePayload>
          }
          createMany: {
            args: Prisma.TenantUsageCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TenantUsageCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantUsagePayload>[]
          }
          delete: {
            args: Prisma.TenantUsageDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantUsagePayload>
          }
          update: {
            args: Prisma.TenantUsageUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantUsagePayload>
          }
          deleteMany: {
            args: Prisma.TenantUsageDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.TenantUsageUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.TenantUsageUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$TenantUsagePayload>
          }
          aggregate: {
            args: Prisma.TenantUsageAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateTenantUsage>
          }
          groupBy: {
            args: Prisma.TenantUsageGroupByArgs<ExtArgs>,
            result: $Utils.Optional<TenantUsageGroupByOutputType>[]
          }
          count: {
            args: Prisma.TenantUsageCountArgs<ExtArgs>,
            result: $Utils.Optional<TenantUsageCountAggregateOutputType> | number
          }
        }
      }
      UsageAlert: {
        payload: Prisma.$UsageAlertPayload<ExtArgs>
        fields: Prisma.UsageAlertFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UsageAlertFindUniqueArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UsageAlertPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UsageAlertFindUniqueOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UsageAlertPayload>
          }
          findFirst: {
            args: Prisma.UsageAlertFindFirstArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UsageAlertPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UsageAlertFindFirstOrThrowArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UsageAlertPayload>
          }
          findMany: {
            args: Prisma.UsageAlertFindManyArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UsageAlertPayload>[]
          }
          create: {
            args: Prisma.UsageAlertCreateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UsageAlertPayload>
          }
          createMany: {
            args: Prisma.UsageAlertCreateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UsageAlertCreateManyAndReturnArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UsageAlertPayload>[]
          }
          delete: {
            args: Prisma.UsageAlertDeleteArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UsageAlertPayload>
          }
          update: {
            args: Prisma.UsageAlertUpdateArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UsageAlertPayload>
          }
          deleteMany: {
            args: Prisma.UsageAlertDeleteManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          updateMany: {
            args: Prisma.UsageAlertUpdateManyArgs<ExtArgs>,
            result: Prisma.BatchPayload
          }
          upsert: {
            args: Prisma.UsageAlertUpsertArgs<ExtArgs>,
            result: $Utils.PayloadToResult<Prisma.$UsageAlertPayload>
          }
          aggregate: {
            args: Prisma.UsageAlertAggregateArgs<ExtArgs>,
            result: $Utils.Optional<AggregateUsageAlert>
          }
          groupBy: {
            args: Prisma.UsageAlertGroupByArgs<ExtArgs>,
            result: $Utils.Optional<UsageAlertGroupByOutputType>[]
          }
          count: {
            args: Prisma.UsageAlertCountArgs<ExtArgs>,
            result: $Utils.Optional<UsageAlertCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<'define', Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type TenantCountOutputType
   */

  export type TenantCountOutputType = {
    paymentRecords: number
    activityLogs: number
    metrics: number
    usageHistory: number
    usageAlerts: number
  }

  export type TenantCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paymentRecords?: boolean | TenantCountOutputTypeCountPaymentRecordsArgs
    activityLogs?: boolean | TenantCountOutputTypeCountActivityLogsArgs
    metrics?: boolean | TenantCountOutputTypeCountMetricsArgs
    usageHistory?: boolean | TenantCountOutputTypeCountUsageHistoryArgs
    usageAlerts?: boolean | TenantCountOutputTypeCountUsageAlertsArgs
  }

  // Custom InputTypes
  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantCountOutputType
     */
    select?: TenantCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountPaymentRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentRecordWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountActivityLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantActivityLogWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountMetricsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantMetricsWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountUsageHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantUsageWhereInput
  }

  /**
   * TenantCountOutputType without action
   */
  export type TenantCountOutputTypeCountUsageAlertsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsageAlertWhereInput
  }


  /**
   * Count Type SuperAdminCountOutputType
   */

  export type SuperAdminCountOutputType = {
    activityLogs: number
  }

  export type SuperAdminCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    activityLogs?: boolean | SuperAdminCountOutputTypeCountActivityLogsArgs
  }

  // Custom InputTypes
  /**
   * SuperAdminCountOutputType without action
   */
  export type SuperAdminCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdminCountOutputType
     */
    select?: SuperAdminCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SuperAdminCountOutputType without action
   */
  export type SuperAdminCountOutputTypeCountActivityLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantActivityLogWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Tenant
   */

  export type AggregateTenant = {
    _count: TenantCountAggregateOutputType | null
    _avg: TenantAvgAggregateOutputType | null
    _sum: TenantSumAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  export type TenantAvgAggregateOutputType = {
    monthlyFee: number | null
    lastPaymentAmount: number | null
    customStorageLimitMB: number | null
    customBandwidthLimitGB: number | null
    customOrdersLimit: number | null
    customStaffLimit: number | null
    currentStorageUsageMB: number | null
    currentBandwidthGB: number | null
    currentMonthOrders: number | null
    currentStaffCount: number | null
    lastMonthOverageCharges: number | null
    lastMonthTotalBill: number | null
    maxLocations: number | null
    maxUsers: number | null
    maxDbSizeMB: number | null
    maxApiRequests: number | null
    maxStorageMB: number | null
    currentDbSizeMB: number | null
    currentStorageMB: number | null
  }

  export type TenantSumAggregateOutputType = {
    monthlyFee: number | null
    lastPaymentAmount: number | null
    customStorageLimitMB: number | null
    customBandwidthLimitGB: number | null
    customOrdersLimit: number | null
    customStaffLimit: number | null
    currentStorageUsageMB: number | null
    currentBandwidthGB: number | null
    currentMonthOrders: number | null
    currentStaffCount: number | null
    lastMonthOverageCharges: number | null
    lastMonthTotalBill: number | null
    maxLocations: number | null
    maxUsers: number | null
    maxDbSizeMB: number | null
    maxApiRequests: number | null
    maxStorageMB: number | null
    currentDbSizeMB: number | null
    currentStorageMB: number | null
  }

  export type TenantMinAggregateOutputType = {
    id: string | null
    slug: string | null
    businessName: string | null
    contactName: string | null
    contactEmail: string | null
    contactPhone: string | null
    databaseUrl: string | null
    databaseHost: string | null
    databaseName: string | null
    subscriptionTier: $Enums.SubscriptionTier | null
    subscriptionStatus: $Enums.SubscriptionStatus | null
    trialEndsAt: Date | null
    billingCycleStart: Date | null
    billingCycleEnd: Date | null
    monthlyFee: number | null
    lastPaymentDate: Date | null
    lastPaymentAmount: number | null
    nextPaymentDue: Date | null
    paymentNotes: string | null
    customStorageLimitMB: number | null
    customBandwidthLimitGB: number | null
    customOrdersLimit: number | null
    customStaffLimit: number | null
    hasPrioritySupport: boolean | null
    currentStorageUsageMB: number | null
    currentBandwidthGB: number | null
    currentMonthOrders: number | null
    currentStaffCount: number | null
    lastBillingCalculation: Date | null
    lastMonthOverageCharges: number | null
    lastMonthTotalBill: number | null
    status: $Enums.TenantStatus | null
    isActive: boolean | null
    maxLocations: number | null
    maxUsers: number | null
    maxDbSizeMB: number | null
    maxApiRequests: number | null
    maxStorageMB: number | null
    currentDbSizeMB: number | null
    currentStorageMB: number | null
    dbLimitExceeded: boolean | null
    apiLimitExceeded: boolean | null
    limitExceededAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    activatedAt: Date | null
    suspendedAt: Date | null
  }

  export type TenantMaxAggregateOutputType = {
    id: string | null
    slug: string | null
    businessName: string | null
    contactName: string | null
    contactEmail: string | null
    contactPhone: string | null
    databaseUrl: string | null
    databaseHost: string | null
    databaseName: string | null
    subscriptionTier: $Enums.SubscriptionTier | null
    subscriptionStatus: $Enums.SubscriptionStatus | null
    trialEndsAt: Date | null
    billingCycleStart: Date | null
    billingCycleEnd: Date | null
    monthlyFee: number | null
    lastPaymentDate: Date | null
    lastPaymentAmount: number | null
    nextPaymentDue: Date | null
    paymentNotes: string | null
    customStorageLimitMB: number | null
    customBandwidthLimitGB: number | null
    customOrdersLimit: number | null
    customStaffLimit: number | null
    hasPrioritySupport: boolean | null
    currentStorageUsageMB: number | null
    currentBandwidthGB: number | null
    currentMonthOrders: number | null
    currentStaffCount: number | null
    lastBillingCalculation: Date | null
    lastMonthOverageCharges: number | null
    lastMonthTotalBill: number | null
    status: $Enums.TenantStatus | null
    isActive: boolean | null
    maxLocations: number | null
    maxUsers: number | null
    maxDbSizeMB: number | null
    maxApiRequests: number | null
    maxStorageMB: number | null
    currentDbSizeMB: number | null
    currentStorageMB: number | null
    dbLimitExceeded: boolean | null
    apiLimitExceeded: boolean | null
    limitExceededAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    activatedAt: Date | null
    suspendedAt: Date | null
  }

  export type TenantCountAggregateOutputType = {
    id: number
    slug: number
    businessName: number
    contactName: number
    contactEmail: number
    contactPhone: number
    databaseUrl: number
    databaseHost: number
    databaseName: number
    subscriptionTier: number
    subscriptionStatus: number
    trialEndsAt: number
    billingCycleStart: number
    billingCycleEnd: number
    monthlyFee: number
    lastPaymentDate: number
    lastPaymentAmount: number
    nextPaymentDue: number
    paymentNotes: number
    customStorageLimitMB: number
    customBandwidthLimitGB: number
    customOrdersLimit: number
    customStaffLimit: number
    hasPrioritySupport: number
    currentStorageUsageMB: number
    currentBandwidthGB: number
    currentMonthOrders: number
    currentStaffCount: number
    lastBillingCalculation: number
    lastMonthOverageCharges: number
    lastMonthTotalBill: number
    status: number
    isActive: number
    maxLocations: number
    maxUsers: number
    maxDbSizeMB: number
    maxApiRequests: number
    maxStorageMB: number
    currentDbSizeMB: number
    currentStorageMB: number
    dbLimitExceeded: number
    apiLimitExceeded: number
    limitExceededAt: number
    features: number
    createdAt: number
    updatedAt: number
    activatedAt: number
    suspendedAt: number
    _all: number
  }


  export type TenantAvgAggregateInputType = {
    monthlyFee?: true
    lastPaymentAmount?: true
    customStorageLimitMB?: true
    customBandwidthLimitGB?: true
    customOrdersLimit?: true
    customStaffLimit?: true
    currentStorageUsageMB?: true
    currentBandwidthGB?: true
    currentMonthOrders?: true
    currentStaffCount?: true
    lastMonthOverageCharges?: true
    lastMonthTotalBill?: true
    maxLocations?: true
    maxUsers?: true
    maxDbSizeMB?: true
    maxApiRequests?: true
    maxStorageMB?: true
    currentDbSizeMB?: true
    currentStorageMB?: true
  }

  export type TenantSumAggregateInputType = {
    monthlyFee?: true
    lastPaymentAmount?: true
    customStorageLimitMB?: true
    customBandwidthLimitGB?: true
    customOrdersLimit?: true
    customStaffLimit?: true
    currentStorageUsageMB?: true
    currentBandwidthGB?: true
    currentMonthOrders?: true
    currentStaffCount?: true
    lastMonthOverageCharges?: true
    lastMonthTotalBill?: true
    maxLocations?: true
    maxUsers?: true
    maxDbSizeMB?: true
    maxApiRequests?: true
    maxStorageMB?: true
    currentDbSizeMB?: true
    currentStorageMB?: true
  }

  export type TenantMinAggregateInputType = {
    id?: true
    slug?: true
    businessName?: true
    contactName?: true
    contactEmail?: true
    contactPhone?: true
    databaseUrl?: true
    databaseHost?: true
    databaseName?: true
    subscriptionTier?: true
    subscriptionStatus?: true
    trialEndsAt?: true
    billingCycleStart?: true
    billingCycleEnd?: true
    monthlyFee?: true
    lastPaymentDate?: true
    lastPaymentAmount?: true
    nextPaymentDue?: true
    paymentNotes?: true
    customStorageLimitMB?: true
    customBandwidthLimitGB?: true
    customOrdersLimit?: true
    customStaffLimit?: true
    hasPrioritySupport?: true
    currentStorageUsageMB?: true
    currentBandwidthGB?: true
    currentMonthOrders?: true
    currentStaffCount?: true
    lastBillingCalculation?: true
    lastMonthOverageCharges?: true
    lastMonthTotalBill?: true
    status?: true
    isActive?: true
    maxLocations?: true
    maxUsers?: true
    maxDbSizeMB?: true
    maxApiRequests?: true
    maxStorageMB?: true
    currentDbSizeMB?: true
    currentStorageMB?: true
    dbLimitExceeded?: true
    apiLimitExceeded?: true
    limitExceededAt?: true
    createdAt?: true
    updatedAt?: true
    activatedAt?: true
    suspendedAt?: true
  }

  export type TenantMaxAggregateInputType = {
    id?: true
    slug?: true
    businessName?: true
    contactName?: true
    contactEmail?: true
    contactPhone?: true
    databaseUrl?: true
    databaseHost?: true
    databaseName?: true
    subscriptionTier?: true
    subscriptionStatus?: true
    trialEndsAt?: true
    billingCycleStart?: true
    billingCycleEnd?: true
    monthlyFee?: true
    lastPaymentDate?: true
    lastPaymentAmount?: true
    nextPaymentDue?: true
    paymentNotes?: true
    customStorageLimitMB?: true
    customBandwidthLimitGB?: true
    customOrdersLimit?: true
    customStaffLimit?: true
    hasPrioritySupport?: true
    currentStorageUsageMB?: true
    currentBandwidthGB?: true
    currentMonthOrders?: true
    currentStaffCount?: true
    lastBillingCalculation?: true
    lastMonthOverageCharges?: true
    lastMonthTotalBill?: true
    status?: true
    isActive?: true
    maxLocations?: true
    maxUsers?: true
    maxDbSizeMB?: true
    maxApiRequests?: true
    maxStorageMB?: true
    currentDbSizeMB?: true
    currentStorageMB?: true
    dbLimitExceeded?: true
    apiLimitExceeded?: true
    limitExceededAt?: true
    createdAt?: true
    updatedAt?: true
    activatedAt?: true
    suspendedAt?: true
  }

  export type TenantCountAggregateInputType = {
    id?: true
    slug?: true
    businessName?: true
    contactName?: true
    contactEmail?: true
    contactPhone?: true
    databaseUrl?: true
    databaseHost?: true
    databaseName?: true
    subscriptionTier?: true
    subscriptionStatus?: true
    trialEndsAt?: true
    billingCycleStart?: true
    billingCycleEnd?: true
    monthlyFee?: true
    lastPaymentDate?: true
    lastPaymentAmount?: true
    nextPaymentDue?: true
    paymentNotes?: true
    customStorageLimitMB?: true
    customBandwidthLimitGB?: true
    customOrdersLimit?: true
    customStaffLimit?: true
    hasPrioritySupport?: true
    currentStorageUsageMB?: true
    currentBandwidthGB?: true
    currentMonthOrders?: true
    currentStaffCount?: true
    lastBillingCalculation?: true
    lastMonthOverageCharges?: true
    lastMonthTotalBill?: true
    status?: true
    isActive?: true
    maxLocations?: true
    maxUsers?: true
    maxDbSizeMB?: true
    maxApiRequests?: true
    maxStorageMB?: true
    currentDbSizeMB?: true
    currentStorageMB?: true
    dbLimitExceeded?: true
    apiLimitExceeded?: true
    limitExceededAt?: true
    features?: true
    createdAt?: true
    updatedAt?: true
    activatedAt?: true
    suspendedAt?: true
    _all?: true
  }

  export type TenantAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenant to aggregate.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tenants
    **/
    _count?: true | TenantCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TenantAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TenantSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantMaxAggregateInputType
  }

  export type GetTenantAggregateType<T extends TenantAggregateArgs> = {
        [P in keyof T & keyof AggregateTenant]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenant[P]>
      : GetScalarType<T[P], AggregateTenant[P]>
  }




  export type TenantGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantWhereInput
    orderBy?: TenantOrderByWithAggregationInput | TenantOrderByWithAggregationInput[]
    by: TenantScalarFieldEnum[] | TenantScalarFieldEnum
    having?: TenantScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantCountAggregateInputType | true
    _avg?: TenantAvgAggregateInputType
    _sum?: TenantSumAggregateInputType
    _min?: TenantMinAggregateInputType
    _max?: TenantMaxAggregateInputType
  }

  export type TenantGroupByOutputType = {
    id: string
    slug: string
    businessName: string
    contactName: string
    contactEmail: string
    contactPhone: string | null
    databaseUrl: string
    databaseHost: string
    databaseName: string
    subscriptionTier: $Enums.SubscriptionTier
    subscriptionStatus: $Enums.SubscriptionStatus
    trialEndsAt: Date | null
    billingCycleStart: Date | null
    billingCycleEnd: Date | null
    monthlyFee: number
    lastPaymentDate: Date | null
    lastPaymentAmount: number | null
    nextPaymentDue: Date | null
    paymentNotes: string | null
    customStorageLimitMB: number | null
    customBandwidthLimitGB: number | null
    customOrdersLimit: number | null
    customStaffLimit: number | null
    hasPrioritySupport: boolean
    currentStorageUsageMB: number
    currentBandwidthGB: number
    currentMonthOrders: number
    currentStaffCount: number
    lastBillingCalculation: Date | null
    lastMonthOverageCharges: number
    lastMonthTotalBill: number
    status: $Enums.TenantStatus
    isActive: boolean
    maxLocations: number
    maxUsers: number
    maxDbSizeMB: number
    maxApiRequests: number
    maxStorageMB: number
    currentDbSizeMB: number
    currentStorageMB: number
    dbLimitExceeded: boolean
    apiLimitExceeded: boolean
    limitExceededAt: Date | null
    features: JsonValue | null
    createdAt: Date
    updatedAt: Date
    activatedAt: Date | null
    suspendedAt: Date | null
    _count: TenantCountAggregateOutputType | null
    _avg: TenantAvgAggregateOutputType | null
    _sum: TenantSumAggregateOutputType | null
    _min: TenantMinAggregateOutputType | null
    _max: TenantMaxAggregateOutputType | null
  }

  type GetTenantGroupByPayload<T extends TenantGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantGroupByOutputType[P]>
            : GetScalarType<T[P], TenantGroupByOutputType[P]>
        }
      >
    >


  export type TenantSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    businessName?: boolean
    contactName?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    databaseUrl?: boolean
    databaseHost?: boolean
    databaseName?: boolean
    subscriptionTier?: boolean
    subscriptionStatus?: boolean
    trialEndsAt?: boolean
    billingCycleStart?: boolean
    billingCycleEnd?: boolean
    monthlyFee?: boolean
    lastPaymentDate?: boolean
    lastPaymentAmount?: boolean
    nextPaymentDue?: boolean
    paymentNotes?: boolean
    customStorageLimitMB?: boolean
    customBandwidthLimitGB?: boolean
    customOrdersLimit?: boolean
    customStaffLimit?: boolean
    hasPrioritySupport?: boolean
    currentStorageUsageMB?: boolean
    currentBandwidthGB?: boolean
    currentMonthOrders?: boolean
    currentStaffCount?: boolean
    lastBillingCalculation?: boolean
    lastMonthOverageCharges?: boolean
    lastMonthTotalBill?: boolean
    status?: boolean
    isActive?: boolean
    maxLocations?: boolean
    maxUsers?: boolean
    maxDbSizeMB?: boolean
    maxApiRequests?: boolean
    maxStorageMB?: boolean
    currentDbSizeMB?: boolean
    currentStorageMB?: boolean
    dbLimitExceeded?: boolean
    apiLimitExceeded?: boolean
    limitExceededAt?: boolean
    features?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    activatedAt?: boolean
    suspendedAt?: boolean
    paymentRecords?: boolean | Tenant$paymentRecordsArgs<ExtArgs>
    activityLogs?: boolean | Tenant$activityLogsArgs<ExtArgs>
    metrics?: boolean | Tenant$metricsArgs<ExtArgs>
    usageHistory?: boolean | Tenant$usageHistoryArgs<ExtArgs>
    usageAlerts?: boolean | Tenant$usageAlertsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    slug?: boolean
    businessName?: boolean
    contactName?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    databaseUrl?: boolean
    databaseHost?: boolean
    databaseName?: boolean
    subscriptionTier?: boolean
    subscriptionStatus?: boolean
    trialEndsAt?: boolean
    billingCycleStart?: boolean
    billingCycleEnd?: boolean
    monthlyFee?: boolean
    lastPaymentDate?: boolean
    lastPaymentAmount?: boolean
    nextPaymentDue?: boolean
    paymentNotes?: boolean
    customStorageLimitMB?: boolean
    customBandwidthLimitGB?: boolean
    customOrdersLimit?: boolean
    customStaffLimit?: boolean
    hasPrioritySupport?: boolean
    currentStorageUsageMB?: boolean
    currentBandwidthGB?: boolean
    currentMonthOrders?: boolean
    currentStaffCount?: boolean
    lastBillingCalculation?: boolean
    lastMonthOverageCharges?: boolean
    lastMonthTotalBill?: boolean
    status?: boolean
    isActive?: boolean
    maxLocations?: boolean
    maxUsers?: boolean
    maxDbSizeMB?: boolean
    maxApiRequests?: boolean
    maxStorageMB?: boolean
    currentDbSizeMB?: boolean
    currentStorageMB?: boolean
    dbLimitExceeded?: boolean
    apiLimitExceeded?: boolean
    limitExceededAt?: boolean
    features?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    activatedAt?: boolean
    suspendedAt?: boolean
  }, ExtArgs["result"]["tenant"]>

  export type TenantSelectScalar = {
    id?: boolean
    slug?: boolean
    businessName?: boolean
    contactName?: boolean
    contactEmail?: boolean
    contactPhone?: boolean
    databaseUrl?: boolean
    databaseHost?: boolean
    databaseName?: boolean
    subscriptionTier?: boolean
    subscriptionStatus?: boolean
    trialEndsAt?: boolean
    billingCycleStart?: boolean
    billingCycleEnd?: boolean
    monthlyFee?: boolean
    lastPaymentDate?: boolean
    lastPaymentAmount?: boolean
    nextPaymentDue?: boolean
    paymentNotes?: boolean
    customStorageLimitMB?: boolean
    customBandwidthLimitGB?: boolean
    customOrdersLimit?: boolean
    customStaffLimit?: boolean
    hasPrioritySupport?: boolean
    currentStorageUsageMB?: boolean
    currentBandwidthGB?: boolean
    currentMonthOrders?: boolean
    currentStaffCount?: boolean
    lastBillingCalculation?: boolean
    lastMonthOverageCharges?: boolean
    lastMonthTotalBill?: boolean
    status?: boolean
    isActive?: boolean
    maxLocations?: boolean
    maxUsers?: boolean
    maxDbSizeMB?: boolean
    maxApiRequests?: boolean
    maxStorageMB?: boolean
    currentDbSizeMB?: boolean
    currentStorageMB?: boolean
    dbLimitExceeded?: boolean
    apiLimitExceeded?: boolean
    limitExceededAt?: boolean
    features?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    activatedAt?: boolean
    suspendedAt?: boolean
  }

  export type TenantInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    paymentRecords?: boolean | Tenant$paymentRecordsArgs<ExtArgs>
    activityLogs?: boolean | Tenant$activityLogsArgs<ExtArgs>
    metrics?: boolean | Tenant$metricsArgs<ExtArgs>
    usageHistory?: boolean | Tenant$usageHistoryArgs<ExtArgs>
    usageAlerts?: boolean | Tenant$usageAlertsArgs<ExtArgs>
    _count?: boolean | TenantCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type TenantIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $TenantPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Tenant"
    objects: {
      paymentRecords: Prisma.$PaymentRecordPayload<ExtArgs>[]
      activityLogs: Prisma.$TenantActivityLogPayload<ExtArgs>[]
      metrics: Prisma.$TenantMetricsPayload<ExtArgs>[]
      usageHistory: Prisma.$TenantUsagePayload<ExtArgs>[]
      usageAlerts: Prisma.$UsageAlertPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      slug: string
      businessName: string
      contactName: string
      contactEmail: string
      contactPhone: string | null
      databaseUrl: string
      databaseHost: string
      databaseName: string
      subscriptionTier: $Enums.SubscriptionTier
      subscriptionStatus: $Enums.SubscriptionStatus
      trialEndsAt: Date | null
      billingCycleStart: Date | null
      billingCycleEnd: Date | null
      monthlyFee: number
      lastPaymentDate: Date | null
      lastPaymentAmount: number | null
      nextPaymentDue: Date | null
      paymentNotes: string | null
      customStorageLimitMB: number | null
      customBandwidthLimitGB: number | null
      customOrdersLimit: number | null
      customStaffLimit: number | null
      hasPrioritySupport: boolean
      currentStorageUsageMB: number
      currentBandwidthGB: number
      currentMonthOrders: number
      currentStaffCount: number
      lastBillingCalculation: Date | null
      lastMonthOverageCharges: number
      lastMonthTotalBill: number
      status: $Enums.TenantStatus
      isActive: boolean
      maxLocations: number
      maxUsers: number
      maxDbSizeMB: number
      maxApiRequests: number
      maxStorageMB: number
      currentDbSizeMB: number
      currentStorageMB: number
      dbLimitExceeded: boolean
      apiLimitExceeded: boolean
      limitExceededAt: Date | null
      features: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date
      activatedAt: Date | null
      suspendedAt: Date | null
    }, ExtArgs["result"]["tenant"]>
    composites: {}
  }

  type TenantGetPayload<S extends boolean | null | undefined | TenantDefaultArgs> = $Result.GetResult<Prisma.$TenantPayload, S>

  type TenantCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TenantFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TenantCountAggregateInputType | true
    }

  export interface TenantDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Tenant'], meta: { name: 'Tenant' } }
    /**
     * Find zero or one Tenant that matches the filter.
     * @param {TenantFindUniqueArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TenantFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, TenantFindUniqueArgs<ExtArgs>>
    ): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one Tenant that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TenantFindUniqueOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends TenantFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first Tenant that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TenantFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantFindFirstArgs<ExtArgs>>
    ): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first Tenant that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindFirstOrThrowArgs} args - Arguments to find a Tenant
     * @example
     * // Get one Tenant
     * const tenant = await prisma.tenant.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends TenantFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more Tenants that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tenants
     * const tenants = await prisma.tenant.findMany()
     * 
     * // Get first 10 Tenants
     * const tenants = await prisma.tenant.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantWithIdOnly = await prisma.tenant.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends TenantFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a Tenant.
     * @param {TenantCreateArgs} args - Arguments to create a Tenant.
     * @example
     * // Create one Tenant
     * const Tenant = await prisma.tenant.create({
     *   data: {
     *     // ... data to create a Tenant
     *   }
     * })
     * 
    **/
    create<T extends TenantCreateArgs<ExtArgs>>(
      args: SelectSubset<T, TenantCreateArgs<ExtArgs>>
    ): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many Tenants.
     * @param {TenantCreateManyArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends TenantCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Tenants and returns the data saved in the database.
     * @param {TenantCreateManyAndReturnArgs} args - Arguments to create many Tenants.
     * @example
     * // Create many Tenants
     * const tenant = await prisma.tenant.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Tenants and only return the `id`
     * const tenantWithIdOnly = await prisma.tenant.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends TenantCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a Tenant.
     * @param {TenantDeleteArgs} args - Arguments to delete one Tenant.
     * @example
     * // Delete one Tenant
     * const Tenant = await prisma.tenant.delete({
     *   where: {
     *     // ... filter to delete one Tenant
     *   }
     * })
     * 
    **/
    delete<T extends TenantDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, TenantDeleteArgs<ExtArgs>>
    ): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one Tenant.
     * @param {TenantUpdateArgs} args - Arguments to update one Tenant.
     * @example
     * // Update one Tenant
     * const tenant = await prisma.tenant.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TenantUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, TenantUpdateArgs<ExtArgs>>
    ): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more Tenants.
     * @param {TenantDeleteManyArgs} args - Arguments to filter Tenants to delete.
     * @example
     * // Delete a few Tenants
     * const { count } = await prisma.tenant.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TenantDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tenants
     * const tenant = await prisma.tenant.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TenantUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, TenantUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Tenant.
     * @param {TenantUpsertArgs} args - Arguments to update or create a Tenant.
     * @example
     * // Update or create a Tenant
     * const tenant = await prisma.tenant.upsert({
     *   create: {
     *     // ... data to create a Tenant
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Tenant we want to update
     *   }
     * })
    **/
    upsert<T extends TenantUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, TenantUpsertArgs<ExtArgs>>
    ): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of Tenants.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantCountArgs} args - Arguments to filter Tenants to count.
     * @example
     * // Count the number of Tenants
     * const count = await prisma.tenant.count({
     *   where: {
     *     // ... the filter for the Tenants we want to count
     *   }
     * })
    **/
    count<T extends TenantCountArgs>(
      args?: Subset<T, TenantCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantAggregateArgs>(args: Subset<T, TenantAggregateArgs>): Prisma.PrismaPromise<GetTenantAggregateType<T>>

    /**
     * Group by Tenant.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantGroupByArgs['orderBy'] }
        : { orderBy?: TenantGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Tenant model
   */
  readonly fields: TenantFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Tenant.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    paymentRecords<T extends Tenant$paymentRecordsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$paymentRecordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, 'findMany'> | Null>;

    activityLogs<T extends Tenant$activityLogsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$activityLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantActivityLogPayload<ExtArgs>, T, 'findMany'> | Null>;

    metrics<T extends Tenant$metricsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$metricsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantMetricsPayload<ExtArgs>, T, 'findMany'> | Null>;

    usageHistory<T extends Tenant$usageHistoryArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$usageHistoryArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantUsagePayload<ExtArgs>, T, 'findMany'> | Null>;

    usageAlerts<T extends Tenant$usageAlertsArgs<ExtArgs> = {}>(args?: Subset<T, Tenant$usageAlertsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageAlertPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the Tenant model
   */ 
  interface TenantFieldRefs {
    readonly id: FieldRef<"Tenant", 'String'>
    readonly slug: FieldRef<"Tenant", 'String'>
    readonly businessName: FieldRef<"Tenant", 'String'>
    readonly contactName: FieldRef<"Tenant", 'String'>
    readonly contactEmail: FieldRef<"Tenant", 'String'>
    readonly contactPhone: FieldRef<"Tenant", 'String'>
    readonly databaseUrl: FieldRef<"Tenant", 'String'>
    readonly databaseHost: FieldRef<"Tenant", 'String'>
    readonly databaseName: FieldRef<"Tenant", 'String'>
    readonly subscriptionTier: FieldRef<"Tenant", 'SubscriptionTier'>
    readonly subscriptionStatus: FieldRef<"Tenant", 'SubscriptionStatus'>
    readonly trialEndsAt: FieldRef<"Tenant", 'DateTime'>
    readonly billingCycleStart: FieldRef<"Tenant", 'DateTime'>
    readonly billingCycleEnd: FieldRef<"Tenant", 'DateTime'>
    readonly monthlyFee: FieldRef<"Tenant", 'Float'>
    readonly lastPaymentDate: FieldRef<"Tenant", 'DateTime'>
    readonly lastPaymentAmount: FieldRef<"Tenant", 'Float'>
    readonly nextPaymentDue: FieldRef<"Tenant", 'DateTime'>
    readonly paymentNotes: FieldRef<"Tenant", 'String'>
    readonly customStorageLimitMB: FieldRef<"Tenant", 'Int'>
    readonly customBandwidthLimitGB: FieldRef<"Tenant", 'Int'>
    readonly customOrdersLimit: FieldRef<"Tenant", 'Int'>
    readonly customStaffLimit: FieldRef<"Tenant", 'Int'>
    readonly hasPrioritySupport: FieldRef<"Tenant", 'Boolean'>
    readonly currentStorageUsageMB: FieldRef<"Tenant", 'Float'>
    readonly currentBandwidthGB: FieldRef<"Tenant", 'Float'>
    readonly currentMonthOrders: FieldRef<"Tenant", 'Int'>
    readonly currentStaffCount: FieldRef<"Tenant", 'Int'>
    readonly lastBillingCalculation: FieldRef<"Tenant", 'DateTime'>
    readonly lastMonthOverageCharges: FieldRef<"Tenant", 'Float'>
    readonly lastMonthTotalBill: FieldRef<"Tenant", 'Float'>
    readonly status: FieldRef<"Tenant", 'TenantStatus'>
    readonly isActive: FieldRef<"Tenant", 'Boolean'>
    readonly maxLocations: FieldRef<"Tenant", 'Int'>
    readonly maxUsers: FieldRef<"Tenant", 'Int'>
    readonly maxDbSizeMB: FieldRef<"Tenant", 'Int'>
    readonly maxApiRequests: FieldRef<"Tenant", 'Int'>
    readonly maxStorageMB: FieldRef<"Tenant", 'Int'>
    readonly currentDbSizeMB: FieldRef<"Tenant", 'Float'>
    readonly currentStorageMB: FieldRef<"Tenant", 'Float'>
    readonly dbLimitExceeded: FieldRef<"Tenant", 'Boolean'>
    readonly apiLimitExceeded: FieldRef<"Tenant", 'Boolean'>
    readonly limitExceededAt: FieldRef<"Tenant", 'DateTime'>
    readonly features: FieldRef<"Tenant", 'Json'>
    readonly createdAt: FieldRef<"Tenant", 'DateTime'>
    readonly updatedAt: FieldRef<"Tenant", 'DateTime'>
    readonly activatedAt: FieldRef<"Tenant", 'DateTime'>
    readonly suspendedAt: FieldRef<"Tenant", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Tenant findUnique
   */
  export type TenantFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findUniqueOrThrow
   */
  export type TenantFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant findFirst
   */
  export type TenantFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findFirstOrThrow
   */
  export type TenantFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenant to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tenants.
     */
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant findMany
   */
  export type TenantFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter, which Tenants to fetch.
     */
    where?: TenantWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tenants to fetch.
     */
    orderBy?: TenantOrderByWithRelationInput | TenantOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tenants.
     */
    cursor?: TenantWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tenants from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tenants.
     */
    skip?: number
    distinct?: TenantScalarFieldEnum | TenantScalarFieldEnum[]
  }

  /**
   * Tenant create
   */
  export type TenantCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to create a Tenant.
     */
    data: XOR<TenantCreateInput, TenantUncheckedCreateInput>
  }

  /**
   * Tenant createMany
   */
  export type TenantCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant createManyAndReturn
   */
  export type TenantCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many Tenants.
     */
    data: TenantCreateManyInput | TenantCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Tenant update
   */
  export type TenantUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The data needed to update a Tenant.
     */
    data: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
    /**
     * Choose, which Tenant to update.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant updateMany
   */
  export type TenantUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tenants.
     */
    data: XOR<TenantUpdateManyMutationInput, TenantUncheckedUpdateManyInput>
    /**
     * Filter which Tenants to update
     */
    where?: TenantWhereInput
  }

  /**
   * Tenant upsert
   */
  export type TenantUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * The filter to search for the Tenant to update in case it exists.
     */
    where: TenantWhereUniqueInput
    /**
     * In case the Tenant found by the `where` argument doesn't exist, create a new Tenant with this data.
     */
    create: XOR<TenantCreateInput, TenantUncheckedCreateInput>
    /**
     * In case the Tenant was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUpdateInput, TenantUncheckedUpdateInput>
  }

  /**
   * Tenant delete
   */
  export type TenantDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
    /**
     * Filter which Tenant to delete.
     */
    where: TenantWhereUniqueInput
  }

  /**
   * Tenant deleteMany
   */
  export type TenantDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tenants to delete
     */
    where?: TenantWhereInput
  }

  /**
   * Tenant.paymentRecords
   */
  export type Tenant$paymentRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    where?: PaymentRecordWhereInput
    orderBy?: PaymentRecordOrderByWithRelationInput | PaymentRecordOrderByWithRelationInput[]
    cursor?: PaymentRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PaymentRecordScalarFieldEnum | PaymentRecordScalarFieldEnum[]
  }

  /**
   * Tenant.activityLogs
   */
  export type Tenant$activityLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantActivityLog
     */
    select?: TenantActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantActivityLogInclude<ExtArgs> | null
    where?: TenantActivityLogWhereInput
    orderBy?: TenantActivityLogOrderByWithRelationInput | TenantActivityLogOrderByWithRelationInput[]
    cursor?: TenantActivityLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantActivityLogScalarFieldEnum | TenantActivityLogScalarFieldEnum[]
  }

  /**
   * Tenant.metrics
   */
  export type Tenant$metricsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMetrics
     */
    select?: TenantMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantMetricsInclude<ExtArgs> | null
    where?: TenantMetricsWhereInput
    orderBy?: TenantMetricsOrderByWithRelationInput | TenantMetricsOrderByWithRelationInput[]
    cursor?: TenantMetricsWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantMetricsScalarFieldEnum | TenantMetricsScalarFieldEnum[]
  }

  /**
   * Tenant.usageHistory
   */
  export type Tenant$usageHistoryArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsage
     */
    select?: TenantUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUsageInclude<ExtArgs> | null
    where?: TenantUsageWhereInput
    orderBy?: TenantUsageOrderByWithRelationInput | TenantUsageOrderByWithRelationInput[]
    cursor?: TenantUsageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantUsageScalarFieldEnum | TenantUsageScalarFieldEnum[]
  }

  /**
   * Tenant.usageAlerts
   */
  export type Tenant$usageAlertsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageAlert
     */
    select?: UsageAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageAlertInclude<ExtArgs> | null
    where?: UsageAlertWhereInput
    orderBy?: UsageAlertOrderByWithRelationInput | UsageAlertOrderByWithRelationInput[]
    cursor?: UsageAlertWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UsageAlertScalarFieldEnum | UsageAlertScalarFieldEnum[]
  }

  /**
   * Tenant without action
   */
  export type TenantDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Tenant
     */
    select?: TenantSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantInclude<ExtArgs> | null
  }


  /**
   * Model PaymentRecord
   */

  export type AggregatePaymentRecord = {
    _count: PaymentRecordCountAggregateOutputType | null
    _avg: PaymentRecordAvgAggregateOutputType | null
    _sum: PaymentRecordSumAggregateOutputType | null
    _min: PaymentRecordMinAggregateOutputType | null
    _max: PaymentRecordMaxAggregateOutputType | null
  }

  export type PaymentRecordAvgAggregateOutputType = {
    amount: number | null
  }

  export type PaymentRecordSumAggregateOutputType = {
    amount: number | null
  }

  export type PaymentRecordMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    amount: number | null
    paymentDate: Date | null
    paymentMethod: string | null
    referenceNumber: string | null
    billingPeriodStart: Date | null
    billingPeriodEnd: Date | null
    notes: string | null
    receivedBy: string | null
    createdAt: Date | null
  }

  export type PaymentRecordMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    amount: number | null
    paymentDate: Date | null
    paymentMethod: string | null
    referenceNumber: string | null
    billingPeriodStart: Date | null
    billingPeriodEnd: Date | null
    notes: string | null
    receivedBy: string | null
    createdAt: Date | null
  }

  export type PaymentRecordCountAggregateOutputType = {
    id: number
    tenantId: number
    amount: number
    paymentDate: number
    paymentMethod: number
    referenceNumber: number
    billingPeriodStart: number
    billingPeriodEnd: number
    notes: number
    receivedBy: number
    createdAt: number
    _all: number
  }


  export type PaymentRecordAvgAggregateInputType = {
    amount?: true
  }

  export type PaymentRecordSumAggregateInputType = {
    amount?: true
  }

  export type PaymentRecordMinAggregateInputType = {
    id?: true
    tenantId?: true
    amount?: true
    paymentDate?: true
    paymentMethod?: true
    referenceNumber?: true
    billingPeriodStart?: true
    billingPeriodEnd?: true
    notes?: true
    receivedBy?: true
    createdAt?: true
  }

  export type PaymentRecordMaxAggregateInputType = {
    id?: true
    tenantId?: true
    amount?: true
    paymentDate?: true
    paymentMethod?: true
    referenceNumber?: true
    billingPeriodStart?: true
    billingPeriodEnd?: true
    notes?: true
    receivedBy?: true
    createdAt?: true
  }

  export type PaymentRecordCountAggregateInputType = {
    id?: true
    tenantId?: true
    amount?: true
    paymentDate?: true
    paymentMethod?: true
    referenceNumber?: true
    billingPeriodStart?: true
    billingPeriodEnd?: true
    notes?: true
    receivedBy?: true
    createdAt?: true
    _all?: true
  }

  export type PaymentRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentRecord to aggregate.
     */
    where?: PaymentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentRecords to fetch.
     */
    orderBy?: PaymentRecordOrderByWithRelationInput | PaymentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PaymentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PaymentRecords
    **/
    _count?: true | PaymentRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PaymentRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PaymentRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PaymentRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PaymentRecordMaxAggregateInputType
  }

  export type GetPaymentRecordAggregateType<T extends PaymentRecordAggregateArgs> = {
        [P in keyof T & keyof AggregatePaymentRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePaymentRecord[P]>
      : GetScalarType<T[P], AggregatePaymentRecord[P]>
  }




  export type PaymentRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PaymentRecordWhereInput
    orderBy?: PaymentRecordOrderByWithAggregationInput | PaymentRecordOrderByWithAggregationInput[]
    by: PaymentRecordScalarFieldEnum[] | PaymentRecordScalarFieldEnum
    having?: PaymentRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PaymentRecordCountAggregateInputType | true
    _avg?: PaymentRecordAvgAggregateInputType
    _sum?: PaymentRecordSumAggregateInputType
    _min?: PaymentRecordMinAggregateInputType
    _max?: PaymentRecordMaxAggregateInputType
  }

  export type PaymentRecordGroupByOutputType = {
    id: string
    tenantId: string
    amount: number
    paymentDate: Date
    paymentMethod: string
    referenceNumber: string | null
    billingPeriodStart: Date
    billingPeriodEnd: Date
    notes: string | null
    receivedBy: string
    createdAt: Date
    _count: PaymentRecordCountAggregateOutputType | null
    _avg: PaymentRecordAvgAggregateOutputType | null
    _sum: PaymentRecordSumAggregateOutputType | null
    _min: PaymentRecordMinAggregateOutputType | null
    _max: PaymentRecordMaxAggregateOutputType | null
  }

  type GetPaymentRecordGroupByPayload<T extends PaymentRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PaymentRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PaymentRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PaymentRecordGroupByOutputType[P]>
            : GetScalarType<T[P], PaymentRecordGroupByOutputType[P]>
        }
      >
    >


  export type PaymentRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    amount?: boolean
    paymentDate?: boolean
    paymentMethod?: boolean
    referenceNumber?: boolean
    billingPeriodStart?: boolean
    billingPeriodEnd?: boolean
    notes?: boolean
    receivedBy?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentRecord"]>

  export type PaymentRecordSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    amount?: boolean
    paymentDate?: boolean
    paymentMethod?: boolean
    referenceNumber?: boolean
    billingPeriodStart?: boolean
    billingPeriodEnd?: boolean
    notes?: boolean
    receivedBy?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["paymentRecord"]>

  export type PaymentRecordSelectScalar = {
    id?: boolean
    tenantId?: boolean
    amount?: boolean
    paymentDate?: boolean
    paymentMethod?: boolean
    referenceNumber?: boolean
    billingPeriodStart?: boolean
    billingPeriodEnd?: boolean
    notes?: boolean
    receivedBy?: boolean
    createdAt?: boolean
  }

  export type PaymentRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type PaymentRecordIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $PaymentRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PaymentRecord"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      amount: number
      paymentDate: Date
      paymentMethod: string
      referenceNumber: string | null
      billingPeriodStart: Date
      billingPeriodEnd: Date
      notes: string | null
      receivedBy: string
      createdAt: Date
    }, ExtArgs["result"]["paymentRecord"]>
    composites: {}
  }

  type PaymentRecordGetPayload<S extends boolean | null | undefined | PaymentRecordDefaultArgs> = $Result.GetResult<Prisma.$PaymentRecordPayload, S>

  type PaymentRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<PaymentRecordFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: PaymentRecordCountAggregateInputType | true
    }

  export interface PaymentRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PaymentRecord'], meta: { name: 'PaymentRecord' } }
    /**
     * Find zero or one PaymentRecord that matches the filter.
     * @param {PaymentRecordFindUniqueArgs} args - Arguments to find a PaymentRecord
     * @example
     * // Get one PaymentRecord
     * const paymentRecord = await prisma.paymentRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends PaymentRecordFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, PaymentRecordFindUniqueArgs<ExtArgs>>
    ): Prisma__PaymentRecordClient<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one PaymentRecord that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {PaymentRecordFindUniqueOrThrowArgs} args - Arguments to find a PaymentRecord
     * @example
     * // Get one PaymentRecord
     * const paymentRecord = await prisma.paymentRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends PaymentRecordFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, PaymentRecordFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__PaymentRecordClient<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first PaymentRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRecordFindFirstArgs} args - Arguments to find a PaymentRecord
     * @example
     * // Get one PaymentRecord
     * const paymentRecord = await prisma.paymentRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends PaymentRecordFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, PaymentRecordFindFirstArgs<ExtArgs>>
    ): Prisma__PaymentRecordClient<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first PaymentRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRecordFindFirstOrThrowArgs} args - Arguments to find a PaymentRecord
     * @example
     * // Get one PaymentRecord
     * const paymentRecord = await prisma.paymentRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends PaymentRecordFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, PaymentRecordFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__PaymentRecordClient<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more PaymentRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PaymentRecords
     * const paymentRecords = await prisma.paymentRecord.findMany()
     * 
     * // Get first 10 PaymentRecords
     * const paymentRecords = await prisma.paymentRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const paymentRecordWithIdOnly = await prisma.paymentRecord.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends PaymentRecordFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, PaymentRecordFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a PaymentRecord.
     * @param {PaymentRecordCreateArgs} args - Arguments to create a PaymentRecord.
     * @example
     * // Create one PaymentRecord
     * const PaymentRecord = await prisma.paymentRecord.create({
     *   data: {
     *     // ... data to create a PaymentRecord
     *   }
     * })
     * 
    **/
    create<T extends PaymentRecordCreateArgs<ExtArgs>>(
      args: SelectSubset<T, PaymentRecordCreateArgs<ExtArgs>>
    ): Prisma__PaymentRecordClient<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many PaymentRecords.
     * @param {PaymentRecordCreateManyArgs} args - Arguments to create many PaymentRecords.
     * @example
     * // Create many PaymentRecords
     * const paymentRecord = await prisma.paymentRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends PaymentRecordCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, PaymentRecordCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PaymentRecords and returns the data saved in the database.
     * @param {PaymentRecordCreateManyAndReturnArgs} args - Arguments to create many PaymentRecords.
     * @example
     * // Create many PaymentRecords
     * const paymentRecord = await prisma.paymentRecord.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PaymentRecords and only return the `id`
     * const paymentRecordWithIdOnly = await prisma.paymentRecord.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends PaymentRecordCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, PaymentRecordCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a PaymentRecord.
     * @param {PaymentRecordDeleteArgs} args - Arguments to delete one PaymentRecord.
     * @example
     * // Delete one PaymentRecord
     * const PaymentRecord = await prisma.paymentRecord.delete({
     *   where: {
     *     // ... filter to delete one PaymentRecord
     *   }
     * })
     * 
    **/
    delete<T extends PaymentRecordDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, PaymentRecordDeleteArgs<ExtArgs>>
    ): Prisma__PaymentRecordClient<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one PaymentRecord.
     * @param {PaymentRecordUpdateArgs} args - Arguments to update one PaymentRecord.
     * @example
     * // Update one PaymentRecord
     * const paymentRecord = await prisma.paymentRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends PaymentRecordUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, PaymentRecordUpdateArgs<ExtArgs>>
    ): Prisma__PaymentRecordClient<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more PaymentRecords.
     * @param {PaymentRecordDeleteManyArgs} args - Arguments to filter PaymentRecords to delete.
     * @example
     * // Delete a few PaymentRecords
     * const { count } = await prisma.paymentRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends PaymentRecordDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, PaymentRecordDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PaymentRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PaymentRecords
     * const paymentRecord = await prisma.paymentRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends PaymentRecordUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, PaymentRecordUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one PaymentRecord.
     * @param {PaymentRecordUpsertArgs} args - Arguments to update or create a PaymentRecord.
     * @example
     * // Update or create a PaymentRecord
     * const paymentRecord = await prisma.paymentRecord.upsert({
     *   create: {
     *     // ... data to create a PaymentRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PaymentRecord we want to update
     *   }
     * })
    **/
    upsert<T extends PaymentRecordUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, PaymentRecordUpsertArgs<ExtArgs>>
    ): Prisma__PaymentRecordClient<$Result.GetResult<Prisma.$PaymentRecordPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of PaymentRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRecordCountArgs} args - Arguments to filter PaymentRecords to count.
     * @example
     * // Count the number of PaymentRecords
     * const count = await prisma.paymentRecord.count({
     *   where: {
     *     // ... the filter for the PaymentRecords we want to count
     *   }
     * })
    **/
    count<T extends PaymentRecordCountArgs>(
      args?: Subset<T, PaymentRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PaymentRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PaymentRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PaymentRecordAggregateArgs>(args: Subset<T, PaymentRecordAggregateArgs>): Prisma.PrismaPromise<GetPaymentRecordAggregateType<T>>

    /**
     * Group by PaymentRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PaymentRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PaymentRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PaymentRecordGroupByArgs['orderBy'] }
        : { orderBy?: PaymentRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PaymentRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPaymentRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PaymentRecord model
   */
  readonly fields: PaymentRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PaymentRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PaymentRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the PaymentRecord model
   */ 
  interface PaymentRecordFieldRefs {
    readonly id: FieldRef<"PaymentRecord", 'String'>
    readonly tenantId: FieldRef<"PaymentRecord", 'String'>
    readonly amount: FieldRef<"PaymentRecord", 'Float'>
    readonly paymentDate: FieldRef<"PaymentRecord", 'DateTime'>
    readonly paymentMethod: FieldRef<"PaymentRecord", 'String'>
    readonly referenceNumber: FieldRef<"PaymentRecord", 'String'>
    readonly billingPeriodStart: FieldRef<"PaymentRecord", 'DateTime'>
    readonly billingPeriodEnd: FieldRef<"PaymentRecord", 'DateTime'>
    readonly notes: FieldRef<"PaymentRecord", 'String'>
    readonly receivedBy: FieldRef<"PaymentRecord", 'String'>
    readonly createdAt: FieldRef<"PaymentRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PaymentRecord findUnique
   */
  export type PaymentRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    /**
     * Filter, which PaymentRecord to fetch.
     */
    where: PaymentRecordWhereUniqueInput
  }

  /**
   * PaymentRecord findUniqueOrThrow
   */
  export type PaymentRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    /**
     * Filter, which PaymentRecord to fetch.
     */
    where: PaymentRecordWhereUniqueInput
  }

  /**
   * PaymentRecord findFirst
   */
  export type PaymentRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    /**
     * Filter, which PaymentRecord to fetch.
     */
    where?: PaymentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentRecords to fetch.
     */
    orderBy?: PaymentRecordOrderByWithRelationInput | PaymentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentRecords.
     */
    cursor?: PaymentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentRecords.
     */
    distinct?: PaymentRecordScalarFieldEnum | PaymentRecordScalarFieldEnum[]
  }

  /**
   * PaymentRecord findFirstOrThrow
   */
  export type PaymentRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    /**
     * Filter, which PaymentRecord to fetch.
     */
    where?: PaymentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentRecords to fetch.
     */
    orderBy?: PaymentRecordOrderByWithRelationInput | PaymentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PaymentRecords.
     */
    cursor?: PaymentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PaymentRecords.
     */
    distinct?: PaymentRecordScalarFieldEnum | PaymentRecordScalarFieldEnum[]
  }

  /**
   * PaymentRecord findMany
   */
  export type PaymentRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    /**
     * Filter, which PaymentRecords to fetch.
     */
    where?: PaymentRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PaymentRecords to fetch.
     */
    orderBy?: PaymentRecordOrderByWithRelationInput | PaymentRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PaymentRecords.
     */
    cursor?: PaymentRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PaymentRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PaymentRecords.
     */
    skip?: number
    distinct?: PaymentRecordScalarFieldEnum | PaymentRecordScalarFieldEnum[]
  }

  /**
   * PaymentRecord create
   */
  export type PaymentRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a PaymentRecord.
     */
    data: XOR<PaymentRecordCreateInput, PaymentRecordUncheckedCreateInput>
  }

  /**
   * PaymentRecord createMany
   */
  export type PaymentRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PaymentRecords.
     */
    data: PaymentRecordCreateManyInput | PaymentRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PaymentRecord createManyAndReturn
   */
  export type PaymentRecordCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many PaymentRecords.
     */
    data: PaymentRecordCreateManyInput | PaymentRecordCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PaymentRecord update
   */
  export type PaymentRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a PaymentRecord.
     */
    data: XOR<PaymentRecordUpdateInput, PaymentRecordUncheckedUpdateInput>
    /**
     * Choose, which PaymentRecord to update.
     */
    where: PaymentRecordWhereUniqueInput
  }

  /**
   * PaymentRecord updateMany
   */
  export type PaymentRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PaymentRecords.
     */
    data: XOR<PaymentRecordUpdateManyMutationInput, PaymentRecordUncheckedUpdateManyInput>
    /**
     * Filter which PaymentRecords to update
     */
    where?: PaymentRecordWhereInput
  }

  /**
   * PaymentRecord upsert
   */
  export type PaymentRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the PaymentRecord to update in case it exists.
     */
    where: PaymentRecordWhereUniqueInput
    /**
     * In case the PaymentRecord found by the `where` argument doesn't exist, create a new PaymentRecord with this data.
     */
    create: XOR<PaymentRecordCreateInput, PaymentRecordUncheckedCreateInput>
    /**
     * In case the PaymentRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PaymentRecordUpdateInput, PaymentRecordUncheckedUpdateInput>
  }

  /**
   * PaymentRecord delete
   */
  export type PaymentRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
    /**
     * Filter which PaymentRecord to delete.
     */
    where: PaymentRecordWhereUniqueInput
  }

  /**
   * PaymentRecord deleteMany
   */
  export type PaymentRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PaymentRecords to delete
     */
    where?: PaymentRecordWhereInput
  }

  /**
   * PaymentRecord without action
   */
  export type PaymentRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PaymentRecord
     */
    select?: PaymentRecordSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PaymentRecordInclude<ExtArgs> | null
  }


  /**
   * Model SuperAdmin
   */

  export type AggregateSuperAdmin = {
    _count: SuperAdminCountAggregateOutputType | null
    _avg: SuperAdminAvgAggregateOutputType | null
    _sum: SuperAdminSumAggregateOutputType | null
    _min: SuperAdminMinAggregateOutputType | null
    _max: SuperAdminMaxAggregateOutputType | null
  }

  export type SuperAdminAvgAggregateOutputType = {
    failedLoginAttempts: number | null
  }

  export type SuperAdminSumAggregateOutputType = {
    failedLoginAttempts: number | null
  }

  export type SuperAdminMinAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.SuperAdminRole | null
    isActive: boolean | null
    failedLoginAttempts: number | null
    lockedUntil: Date | null
    lastFailedLogin: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    lastLoginAt: Date | null
  }

  export type SuperAdminMaxAggregateOutputType = {
    id: string | null
    name: string | null
    email: string | null
    password: string | null
    role: $Enums.SuperAdminRole | null
    isActive: boolean | null
    failedLoginAttempts: number | null
    lockedUntil: Date | null
    lastFailedLogin: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    lastLoginAt: Date | null
  }

  export type SuperAdminCountAggregateOutputType = {
    id: number
    name: number
    email: number
    password: number
    role: number
    isActive: number
    failedLoginAttempts: number
    lockedUntil: number
    lastFailedLogin: number
    createdAt: number
    updatedAt: number
    lastLoginAt: number
    _all: number
  }


  export type SuperAdminAvgAggregateInputType = {
    failedLoginAttempts?: true
  }

  export type SuperAdminSumAggregateInputType = {
    failedLoginAttempts?: true
  }

  export type SuperAdminMinAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    isActive?: true
    failedLoginAttempts?: true
    lockedUntil?: true
    lastFailedLogin?: true
    createdAt?: true
    updatedAt?: true
    lastLoginAt?: true
  }

  export type SuperAdminMaxAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    isActive?: true
    failedLoginAttempts?: true
    lockedUntil?: true
    lastFailedLogin?: true
    createdAt?: true
    updatedAt?: true
    lastLoginAt?: true
  }

  export type SuperAdminCountAggregateInputType = {
    id?: true
    name?: true
    email?: true
    password?: true
    role?: true
    isActive?: true
    failedLoginAttempts?: true
    lockedUntil?: true
    lastFailedLogin?: true
    createdAt?: true
    updatedAt?: true
    lastLoginAt?: true
    _all?: true
  }

  export type SuperAdminAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SuperAdmin to aggregate.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SuperAdmins
    **/
    _count?: true | SuperAdminCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SuperAdminAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SuperAdminSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SuperAdminMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SuperAdminMaxAggregateInputType
  }

  export type GetSuperAdminAggregateType<T extends SuperAdminAggregateArgs> = {
        [P in keyof T & keyof AggregateSuperAdmin]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSuperAdmin[P]>
      : GetScalarType<T[P], AggregateSuperAdmin[P]>
  }




  export type SuperAdminGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SuperAdminWhereInput
    orderBy?: SuperAdminOrderByWithAggregationInput | SuperAdminOrderByWithAggregationInput[]
    by: SuperAdminScalarFieldEnum[] | SuperAdminScalarFieldEnum
    having?: SuperAdminScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SuperAdminCountAggregateInputType | true
    _avg?: SuperAdminAvgAggregateInputType
    _sum?: SuperAdminSumAggregateInputType
    _min?: SuperAdminMinAggregateInputType
    _max?: SuperAdminMaxAggregateInputType
  }

  export type SuperAdminGroupByOutputType = {
    id: string
    name: string
    email: string
    password: string
    role: $Enums.SuperAdminRole
    isActive: boolean
    failedLoginAttempts: number
    lockedUntil: Date | null
    lastFailedLogin: Date | null
    createdAt: Date
    updatedAt: Date
    lastLoginAt: Date | null
    _count: SuperAdminCountAggregateOutputType | null
    _avg: SuperAdminAvgAggregateOutputType | null
    _sum: SuperAdminSumAggregateOutputType | null
    _min: SuperAdminMinAggregateOutputType | null
    _max: SuperAdminMaxAggregateOutputType | null
  }

  type GetSuperAdminGroupByPayload<T extends SuperAdminGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SuperAdminGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SuperAdminGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SuperAdminGroupByOutputType[P]>
            : GetScalarType<T[P], SuperAdminGroupByOutputType[P]>
        }
      >
    >


  export type SuperAdminSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    isActive?: boolean
    failedLoginAttempts?: boolean
    lockedUntil?: boolean
    lastFailedLogin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastLoginAt?: boolean
    activityLogs?: boolean | SuperAdmin$activityLogsArgs<ExtArgs>
    _count?: boolean | SuperAdminCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["superAdmin"]>

  export type SuperAdminSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    isActive?: boolean
    failedLoginAttempts?: boolean
    lockedUntil?: boolean
    lastFailedLogin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastLoginAt?: boolean
  }, ExtArgs["result"]["superAdmin"]>

  export type SuperAdminSelectScalar = {
    id?: boolean
    name?: boolean
    email?: boolean
    password?: boolean
    role?: boolean
    isActive?: boolean
    failedLoginAttempts?: boolean
    lockedUntil?: boolean
    lastFailedLogin?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    lastLoginAt?: boolean
  }

  export type SuperAdminInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    activityLogs?: boolean | SuperAdmin$activityLogsArgs<ExtArgs>
    _count?: boolean | SuperAdminCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SuperAdminIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SuperAdminPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SuperAdmin"
    objects: {
      activityLogs: Prisma.$TenantActivityLogPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      email: string
      password: string
      role: $Enums.SuperAdminRole
      isActive: boolean
      failedLoginAttempts: number
      lockedUntil: Date | null
      lastFailedLogin: Date | null
      createdAt: Date
      updatedAt: Date
      lastLoginAt: Date | null
    }, ExtArgs["result"]["superAdmin"]>
    composites: {}
  }

  type SuperAdminGetPayload<S extends boolean | null | undefined | SuperAdminDefaultArgs> = $Result.GetResult<Prisma.$SuperAdminPayload, S>

  type SuperAdminCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<SuperAdminFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: SuperAdminCountAggregateInputType | true
    }

  export interface SuperAdminDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SuperAdmin'], meta: { name: 'SuperAdmin' } }
    /**
     * Find zero or one SuperAdmin that matches the filter.
     * @param {SuperAdminFindUniqueArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends SuperAdminFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, SuperAdminFindUniqueArgs<ExtArgs>>
    ): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one SuperAdmin that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {SuperAdminFindUniqueOrThrowArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends SuperAdminFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SuperAdminFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first SuperAdmin that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminFindFirstArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends SuperAdminFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, SuperAdminFindFirstArgs<ExtArgs>>
    ): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first SuperAdmin that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminFindFirstOrThrowArgs} args - Arguments to find a SuperAdmin
     * @example
     * // Get one SuperAdmin
     * const superAdmin = await prisma.superAdmin.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends SuperAdminFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, SuperAdminFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more SuperAdmins that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SuperAdmins
     * const superAdmins = await prisma.superAdmin.findMany()
     * 
     * // Get first 10 SuperAdmins
     * const superAdmins = await prisma.superAdmin.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const superAdminWithIdOnly = await prisma.superAdmin.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends SuperAdminFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SuperAdminFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a SuperAdmin.
     * @param {SuperAdminCreateArgs} args - Arguments to create a SuperAdmin.
     * @example
     * // Create one SuperAdmin
     * const SuperAdmin = await prisma.superAdmin.create({
     *   data: {
     *     // ... data to create a SuperAdmin
     *   }
     * })
     * 
    **/
    create<T extends SuperAdminCreateArgs<ExtArgs>>(
      args: SelectSubset<T, SuperAdminCreateArgs<ExtArgs>>
    ): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many SuperAdmins.
     * @param {SuperAdminCreateManyArgs} args - Arguments to create many SuperAdmins.
     * @example
     * // Create many SuperAdmins
     * const superAdmin = await prisma.superAdmin.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends SuperAdminCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SuperAdminCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SuperAdmins and returns the data saved in the database.
     * @param {SuperAdminCreateManyAndReturnArgs} args - Arguments to create many SuperAdmins.
     * @example
     * // Create many SuperAdmins
     * const superAdmin = await prisma.superAdmin.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SuperAdmins and only return the `id`
     * const superAdminWithIdOnly = await prisma.superAdmin.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends SuperAdminCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, SuperAdminCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a SuperAdmin.
     * @param {SuperAdminDeleteArgs} args - Arguments to delete one SuperAdmin.
     * @example
     * // Delete one SuperAdmin
     * const SuperAdmin = await prisma.superAdmin.delete({
     *   where: {
     *     // ... filter to delete one SuperAdmin
     *   }
     * })
     * 
    **/
    delete<T extends SuperAdminDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, SuperAdminDeleteArgs<ExtArgs>>
    ): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one SuperAdmin.
     * @param {SuperAdminUpdateArgs} args - Arguments to update one SuperAdmin.
     * @example
     * // Update one SuperAdmin
     * const superAdmin = await prisma.superAdmin.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends SuperAdminUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, SuperAdminUpdateArgs<ExtArgs>>
    ): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more SuperAdmins.
     * @param {SuperAdminDeleteManyArgs} args - Arguments to filter SuperAdmins to delete.
     * @example
     * // Delete a few SuperAdmins
     * const { count } = await prisma.superAdmin.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends SuperAdminDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, SuperAdminDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SuperAdmins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SuperAdmins
     * const superAdmin = await prisma.superAdmin.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends SuperAdminUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, SuperAdminUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SuperAdmin.
     * @param {SuperAdminUpsertArgs} args - Arguments to update or create a SuperAdmin.
     * @example
     * // Update or create a SuperAdmin
     * const superAdmin = await prisma.superAdmin.upsert({
     *   create: {
     *     // ... data to create a SuperAdmin
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SuperAdmin we want to update
     *   }
     * })
    **/
    upsert<T extends SuperAdminUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, SuperAdminUpsertArgs<ExtArgs>>
    ): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of SuperAdmins.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminCountArgs} args - Arguments to filter SuperAdmins to count.
     * @example
     * // Count the number of SuperAdmins
     * const count = await prisma.superAdmin.count({
     *   where: {
     *     // ... the filter for the SuperAdmins we want to count
     *   }
     * })
    **/
    count<T extends SuperAdminCountArgs>(
      args?: Subset<T, SuperAdminCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SuperAdminCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SuperAdmin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SuperAdminAggregateArgs>(args: Subset<T, SuperAdminAggregateArgs>): Prisma.PrismaPromise<GetSuperAdminAggregateType<T>>

    /**
     * Group by SuperAdmin.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SuperAdminGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SuperAdminGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SuperAdminGroupByArgs['orderBy'] }
        : { orderBy?: SuperAdminGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SuperAdminGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSuperAdminGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SuperAdmin model
   */
  readonly fields: SuperAdminFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SuperAdmin.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SuperAdminClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    activityLogs<T extends SuperAdmin$activityLogsArgs<ExtArgs> = {}>(args?: Subset<T, SuperAdmin$activityLogsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantActivityLogPayload<ExtArgs>, T, 'findMany'> | Null>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the SuperAdmin model
   */ 
  interface SuperAdminFieldRefs {
    readonly id: FieldRef<"SuperAdmin", 'String'>
    readonly name: FieldRef<"SuperAdmin", 'String'>
    readonly email: FieldRef<"SuperAdmin", 'String'>
    readonly password: FieldRef<"SuperAdmin", 'String'>
    readonly role: FieldRef<"SuperAdmin", 'SuperAdminRole'>
    readonly isActive: FieldRef<"SuperAdmin", 'Boolean'>
    readonly failedLoginAttempts: FieldRef<"SuperAdmin", 'Int'>
    readonly lockedUntil: FieldRef<"SuperAdmin", 'DateTime'>
    readonly lastFailedLogin: FieldRef<"SuperAdmin", 'DateTime'>
    readonly createdAt: FieldRef<"SuperAdmin", 'DateTime'>
    readonly updatedAt: FieldRef<"SuperAdmin", 'DateTime'>
    readonly lastLoginAt: FieldRef<"SuperAdmin", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SuperAdmin findUnique
   */
  export type SuperAdminFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminInclude<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin findUniqueOrThrow
   */
  export type SuperAdminFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminInclude<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin findFirst
   */
  export type SuperAdminFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminInclude<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SuperAdmins.
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SuperAdmins.
     */
    distinct?: SuperAdminScalarFieldEnum | SuperAdminScalarFieldEnum[]
  }

  /**
   * SuperAdmin findFirstOrThrow
   */
  export type SuperAdminFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminInclude<ExtArgs> | null
    /**
     * Filter, which SuperAdmin to fetch.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SuperAdmins.
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SuperAdmins.
     */
    distinct?: SuperAdminScalarFieldEnum | SuperAdminScalarFieldEnum[]
  }

  /**
   * SuperAdmin findMany
   */
  export type SuperAdminFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminInclude<ExtArgs> | null
    /**
     * Filter, which SuperAdmins to fetch.
     */
    where?: SuperAdminWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SuperAdmins to fetch.
     */
    orderBy?: SuperAdminOrderByWithRelationInput | SuperAdminOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SuperAdmins.
     */
    cursor?: SuperAdminWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SuperAdmins from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SuperAdmins.
     */
    skip?: number
    distinct?: SuperAdminScalarFieldEnum | SuperAdminScalarFieldEnum[]
  }

  /**
   * SuperAdmin create
   */
  export type SuperAdminCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminInclude<ExtArgs> | null
    /**
     * The data needed to create a SuperAdmin.
     */
    data: XOR<SuperAdminCreateInput, SuperAdminUncheckedCreateInput>
  }

  /**
   * SuperAdmin createMany
   */
  export type SuperAdminCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SuperAdmins.
     */
    data: SuperAdminCreateManyInput | SuperAdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SuperAdmin createManyAndReturn
   */
  export type SuperAdminCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many SuperAdmins.
     */
    data: SuperAdminCreateManyInput | SuperAdminCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SuperAdmin update
   */
  export type SuperAdminUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminInclude<ExtArgs> | null
    /**
     * The data needed to update a SuperAdmin.
     */
    data: XOR<SuperAdminUpdateInput, SuperAdminUncheckedUpdateInput>
    /**
     * Choose, which SuperAdmin to update.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin updateMany
   */
  export type SuperAdminUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SuperAdmins.
     */
    data: XOR<SuperAdminUpdateManyMutationInput, SuperAdminUncheckedUpdateManyInput>
    /**
     * Filter which SuperAdmins to update
     */
    where?: SuperAdminWhereInput
  }

  /**
   * SuperAdmin upsert
   */
  export type SuperAdminUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminInclude<ExtArgs> | null
    /**
     * The filter to search for the SuperAdmin to update in case it exists.
     */
    where: SuperAdminWhereUniqueInput
    /**
     * In case the SuperAdmin found by the `where` argument doesn't exist, create a new SuperAdmin with this data.
     */
    create: XOR<SuperAdminCreateInput, SuperAdminUncheckedCreateInput>
    /**
     * In case the SuperAdmin was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SuperAdminUpdateInput, SuperAdminUncheckedUpdateInput>
  }

  /**
   * SuperAdmin delete
   */
  export type SuperAdminDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminInclude<ExtArgs> | null
    /**
     * Filter which SuperAdmin to delete.
     */
    where: SuperAdminWhereUniqueInput
  }

  /**
   * SuperAdmin deleteMany
   */
  export type SuperAdminDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SuperAdmins to delete
     */
    where?: SuperAdminWhereInput
  }

  /**
   * SuperAdmin.activityLogs
   */
  export type SuperAdmin$activityLogsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantActivityLog
     */
    select?: TenantActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantActivityLogInclude<ExtArgs> | null
    where?: TenantActivityLogWhereInput
    orderBy?: TenantActivityLogOrderByWithRelationInput | TenantActivityLogOrderByWithRelationInput[]
    cursor?: TenantActivityLogWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TenantActivityLogScalarFieldEnum | TenantActivityLogScalarFieldEnum[]
  }

  /**
   * SuperAdmin without action
   */
  export type SuperAdminDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminInclude<ExtArgs> | null
  }


  /**
   * Model TenantActivityLog
   */

  export type AggregateTenantActivityLog = {
    _count: TenantActivityLogCountAggregateOutputType | null
    _min: TenantActivityLogMinAggregateOutputType | null
    _max: TenantActivityLogMaxAggregateOutputType | null
  }

  export type TenantActivityLogMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    action: string | null
    performedBy: string | null
    ipAddress: string | null
    createdAt: Date | null
  }

  export type TenantActivityLogMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    action: string | null
    performedBy: string | null
    ipAddress: string | null
    createdAt: Date | null
  }

  export type TenantActivityLogCountAggregateOutputType = {
    id: number
    tenantId: number
    action: number
    performedBy: number
    details: number
    ipAddress: number
    createdAt: number
    _all: number
  }


  export type TenantActivityLogMinAggregateInputType = {
    id?: true
    tenantId?: true
    action?: true
    performedBy?: true
    ipAddress?: true
    createdAt?: true
  }

  export type TenantActivityLogMaxAggregateInputType = {
    id?: true
    tenantId?: true
    action?: true
    performedBy?: true
    ipAddress?: true
    createdAt?: true
  }

  export type TenantActivityLogCountAggregateInputType = {
    id?: true
    tenantId?: true
    action?: true
    performedBy?: true
    details?: true
    ipAddress?: true
    createdAt?: true
    _all?: true
  }

  export type TenantActivityLogAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantActivityLog to aggregate.
     */
    where?: TenantActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantActivityLogs to fetch.
     */
    orderBy?: TenantActivityLogOrderByWithRelationInput | TenantActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantActivityLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TenantActivityLogs
    **/
    _count?: true | TenantActivityLogCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantActivityLogMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantActivityLogMaxAggregateInputType
  }

  export type GetTenantActivityLogAggregateType<T extends TenantActivityLogAggregateArgs> = {
        [P in keyof T & keyof AggregateTenantActivityLog]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenantActivityLog[P]>
      : GetScalarType<T[P], AggregateTenantActivityLog[P]>
  }




  export type TenantActivityLogGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantActivityLogWhereInput
    orderBy?: TenantActivityLogOrderByWithAggregationInput | TenantActivityLogOrderByWithAggregationInput[]
    by: TenantActivityLogScalarFieldEnum[] | TenantActivityLogScalarFieldEnum
    having?: TenantActivityLogScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantActivityLogCountAggregateInputType | true
    _min?: TenantActivityLogMinAggregateInputType
    _max?: TenantActivityLogMaxAggregateInputType
  }

  export type TenantActivityLogGroupByOutputType = {
    id: string
    tenantId: string
    action: string
    performedBy: string | null
    details: JsonValue | null
    ipAddress: string | null
    createdAt: Date
    _count: TenantActivityLogCountAggregateOutputType | null
    _min: TenantActivityLogMinAggregateOutputType | null
    _max: TenantActivityLogMaxAggregateOutputType | null
  }

  type GetTenantActivityLogGroupByPayload<T extends TenantActivityLogGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantActivityLogGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantActivityLogGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantActivityLogGroupByOutputType[P]>
            : GetScalarType<T[P], TenantActivityLogGroupByOutputType[P]>
        }
      >
    >


  export type TenantActivityLogSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    action?: boolean
    performedBy?: boolean
    details?: boolean
    ipAddress?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    superAdmin?: boolean | TenantActivityLog$superAdminArgs<ExtArgs>
  }, ExtArgs["result"]["tenantActivityLog"]>

  export type TenantActivityLogSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    action?: boolean
    performedBy?: boolean
    details?: boolean
    ipAddress?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    superAdmin?: boolean | TenantActivityLog$superAdminArgs<ExtArgs>
  }, ExtArgs["result"]["tenantActivityLog"]>

  export type TenantActivityLogSelectScalar = {
    id?: boolean
    tenantId?: boolean
    action?: boolean
    performedBy?: boolean
    details?: boolean
    ipAddress?: boolean
    createdAt?: boolean
  }

  export type TenantActivityLogInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    superAdmin?: boolean | TenantActivityLog$superAdminArgs<ExtArgs>
  }
  export type TenantActivityLogIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
    superAdmin?: boolean | TenantActivityLog$superAdminArgs<ExtArgs>
  }

  export type $TenantActivityLogPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TenantActivityLog"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
      superAdmin: Prisma.$SuperAdminPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      action: string
      performedBy: string | null
      details: Prisma.JsonValue | null
      ipAddress: string | null
      createdAt: Date
    }, ExtArgs["result"]["tenantActivityLog"]>
    composites: {}
  }

  type TenantActivityLogGetPayload<S extends boolean | null | undefined | TenantActivityLogDefaultArgs> = $Result.GetResult<Prisma.$TenantActivityLogPayload, S>

  type TenantActivityLogCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TenantActivityLogFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TenantActivityLogCountAggregateInputType | true
    }

  export interface TenantActivityLogDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TenantActivityLog'], meta: { name: 'TenantActivityLog' } }
    /**
     * Find zero or one TenantActivityLog that matches the filter.
     * @param {TenantActivityLogFindUniqueArgs} args - Arguments to find a TenantActivityLog
     * @example
     * // Get one TenantActivityLog
     * const tenantActivityLog = await prisma.tenantActivityLog.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TenantActivityLogFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, TenantActivityLogFindUniqueArgs<ExtArgs>>
    ): Prisma__TenantActivityLogClient<$Result.GetResult<Prisma.$TenantActivityLogPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one TenantActivityLog that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TenantActivityLogFindUniqueOrThrowArgs} args - Arguments to find a TenantActivityLog
     * @example
     * // Get one TenantActivityLog
     * const tenantActivityLog = await prisma.tenantActivityLog.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends TenantActivityLogFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantActivityLogFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__TenantActivityLogClient<$Result.GetResult<Prisma.$TenantActivityLogPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first TenantActivityLog that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantActivityLogFindFirstArgs} args - Arguments to find a TenantActivityLog
     * @example
     * // Get one TenantActivityLog
     * const tenantActivityLog = await prisma.tenantActivityLog.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TenantActivityLogFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantActivityLogFindFirstArgs<ExtArgs>>
    ): Prisma__TenantActivityLogClient<$Result.GetResult<Prisma.$TenantActivityLogPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first TenantActivityLog that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantActivityLogFindFirstOrThrowArgs} args - Arguments to find a TenantActivityLog
     * @example
     * // Get one TenantActivityLog
     * const tenantActivityLog = await prisma.tenantActivityLog.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends TenantActivityLogFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantActivityLogFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__TenantActivityLogClient<$Result.GetResult<Prisma.$TenantActivityLogPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more TenantActivityLogs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantActivityLogFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TenantActivityLogs
     * const tenantActivityLogs = await prisma.tenantActivityLog.findMany()
     * 
     * // Get first 10 TenantActivityLogs
     * const tenantActivityLogs = await prisma.tenantActivityLog.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantActivityLogWithIdOnly = await prisma.tenantActivityLog.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends TenantActivityLogFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantActivityLogFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantActivityLogPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a TenantActivityLog.
     * @param {TenantActivityLogCreateArgs} args - Arguments to create a TenantActivityLog.
     * @example
     * // Create one TenantActivityLog
     * const TenantActivityLog = await prisma.tenantActivityLog.create({
     *   data: {
     *     // ... data to create a TenantActivityLog
     *   }
     * })
     * 
    **/
    create<T extends TenantActivityLogCreateArgs<ExtArgs>>(
      args: SelectSubset<T, TenantActivityLogCreateArgs<ExtArgs>>
    ): Prisma__TenantActivityLogClient<$Result.GetResult<Prisma.$TenantActivityLogPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many TenantActivityLogs.
     * @param {TenantActivityLogCreateManyArgs} args - Arguments to create many TenantActivityLogs.
     * @example
     * // Create many TenantActivityLogs
     * const tenantActivityLog = await prisma.tenantActivityLog.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends TenantActivityLogCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantActivityLogCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TenantActivityLogs and returns the data saved in the database.
     * @param {TenantActivityLogCreateManyAndReturnArgs} args - Arguments to create many TenantActivityLogs.
     * @example
     * // Create many TenantActivityLogs
     * const tenantActivityLog = await prisma.tenantActivityLog.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TenantActivityLogs and only return the `id`
     * const tenantActivityLogWithIdOnly = await prisma.tenantActivityLog.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends TenantActivityLogCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantActivityLogCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantActivityLogPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a TenantActivityLog.
     * @param {TenantActivityLogDeleteArgs} args - Arguments to delete one TenantActivityLog.
     * @example
     * // Delete one TenantActivityLog
     * const TenantActivityLog = await prisma.tenantActivityLog.delete({
     *   where: {
     *     // ... filter to delete one TenantActivityLog
     *   }
     * })
     * 
    **/
    delete<T extends TenantActivityLogDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, TenantActivityLogDeleteArgs<ExtArgs>>
    ): Prisma__TenantActivityLogClient<$Result.GetResult<Prisma.$TenantActivityLogPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one TenantActivityLog.
     * @param {TenantActivityLogUpdateArgs} args - Arguments to update one TenantActivityLog.
     * @example
     * // Update one TenantActivityLog
     * const tenantActivityLog = await prisma.tenantActivityLog.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TenantActivityLogUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, TenantActivityLogUpdateArgs<ExtArgs>>
    ): Prisma__TenantActivityLogClient<$Result.GetResult<Prisma.$TenantActivityLogPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more TenantActivityLogs.
     * @param {TenantActivityLogDeleteManyArgs} args - Arguments to filter TenantActivityLogs to delete.
     * @example
     * // Delete a few TenantActivityLogs
     * const { count } = await prisma.tenantActivityLog.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TenantActivityLogDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantActivityLogDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantActivityLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantActivityLogUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TenantActivityLogs
     * const tenantActivityLog = await prisma.tenantActivityLog.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TenantActivityLogUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, TenantActivityLogUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TenantActivityLog.
     * @param {TenantActivityLogUpsertArgs} args - Arguments to update or create a TenantActivityLog.
     * @example
     * // Update or create a TenantActivityLog
     * const tenantActivityLog = await prisma.tenantActivityLog.upsert({
     *   create: {
     *     // ... data to create a TenantActivityLog
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TenantActivityLog we want to update
     *   }
     * })
    **/
    upsert<T extends TenantActivityLogUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, TenantActivityLogUpsertArgs<ExtArgs>>
    ): Prisma__TenantActivityLogClient<$Result.GetResult<Prisma.$TenantActivityLogPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of TenantActivityLogs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantActivityLogCountArgs} args - Arguments to filter TenantActivityLogs to count.
     * @example
     * // Count the number of TenantActivityLogs
     * const count = await prisma.tenantActivityLog.count({
     *   where: {
     *     // ... the filter for the TenantActivityLogs we want to count
     *   }
     * })
    **/
    count<T extends TenantActivityLogCountArgs>(
      args?: Subset<T, TenantActivityLogCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantActivityLogCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TenantActivityLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantActivityLogAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantActivityLogAggregateArgs>(args: Subset<T, TenantActivityLogAggregateArgs>): Prisma.PrismaPromise<GetTenantActivityLogAggregateType<T>>

    /**
     * Group by TenantActivityLog.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantActivityLogGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantActivityLogGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantActivityLogGroupByArgs['orderBy'] }
        : { orderBy?: TenantActivityLogGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantActivityLogGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantActivityLogGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TenantActivityLog model
   */
  readonly fields: TenantActivityLogFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TenantActivityLog.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantActivityLogClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    superAdmin<T extends TenantActivityLog$superAdminArgs<ExtArgs> = {}>(args?: Subset<T, TenantActivityLog$superAdminArgs<ExtArgs>>): Prisma__SuperAdminClient<$Result.GetResult<Prisma.$SuperAdminPayload<ExtArgs>, T, 'findUniqueOrThrow'> | null, null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the TenantActivityLog model
   */ 
  interface TenantActivityLogFieldRefs {
    readonly id: FieldRef<"TenantActivityLog", 'String'>
    readonly tenantId: FieldRef<"TenantActivityLog", 'String'>
    readonly action: FieldRef<"TenantActivityLog", 'String'>
    readonly performedBy: FieldRef<"TenantActivityLog", 'String'>
    readonly details: FieldRef<"TenantActivityLog", 'Json'>
    readonly ipAddress: FieldRef<"TenantActivityLog", 'String'>
    readonly createdAt: FieldRef<"TenantActivityLog", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TenantActivityLog findUnique
   */
  export type TenantActivityLogFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantActivityLog
     */
    select?: TenantActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which TenantActivityLog to fetch.
     */
    where: TenantActivityLogWhereUniqueInput
  }

  /**
   * TenantActivityLog findUniqueOrThrow
   */
  export type TenantActivityLogFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantActivityLog
     */
    select?: TenantActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which TenantActivityLog to fetch.
     */
    where: TenantActivityLogWhereUniqueInput
  }

  /**
   * TenantActivityLog findFirst
   */
  export type TenantActivityLogFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantActivityLog
     */
    select?: TenantActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which TenantActivityLog to fetch.
     */
    where?: TenantActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantActivityLogs to fetch.
     */
    orderBy?: TenantActivityLogOrderByWithRelationInput | TenantActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantActivityLogs.
     */
    cursor?: TenantActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantActivityLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantActivityLogs.
     */
    distinct?: TenantActivityLogScalarFieldEnum | TenantActivityLogScalarFieldEnum[]
  }

  /**
   * TenantActivityLog findFirstOrThrow
   */
  export type TenantActivityLogFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantActivityLog
     */
    select?: TenantActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which TenantActivityLog to fetch.
     */
    where?: TenantActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantActivityLogs to fetch.
     */
    orderBy?: TenantActivityLogOrderByWithRelationInput | TenantActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantActivityLogs.
     */
    cursor?: TenantActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantActivityLogs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantActivityLogs.
     */
    distinct?: TenantActivityLogScalarFieldEnum | TenantActivityLogScalarFieldEnum[]
  }

  /**
   * TenantActivityLog findMany
   */
  export type TenantActivityLogFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantActivityLog
     */
    select?: TenantActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantActivityLogInclude<ExtArgs> | null
    /**
     * Filter, which TenantActivityLogs to fetch.
     */
    where?: TenantActivityLogWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantActivityLogs to fetch.
     */
    orderBy?: TenantActivityLogOrderByWithRelationInput | TenantActivityLogOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TenantActivityLogs.
     */
    cursor?: TenantActivityLogWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantActivityLogs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantActivityLogs.
     */
    skip?: number
    distinct?: TenantActivityLogScalarFieldEnum | TenantActivityLogScalarFieldEnum[]
  }

  /**
   * TenantActivityLog create
   */
  export type TenantActivityLogCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantActivityLog
     */
    select?: TenantActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantActivityLogInclude<ExtArgs> | null
    /**
     * The data needed to create a TenantActivityLog.
     */
    data: XOR<TenantActivityLogCreateInput, TenantActivityLogUncheckedCreateInput>
  }

  /**
   * TenantActivityLog createMany
   */
  export type TenantActivityLogCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TenantActivityLogs.
     */
    data: TenantActivityLogCreateManyInput | TenantActivityLogCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TenantActivityLog createManyAndReturn
   */
  export type TenantActivityLogCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantActivityLog
     */
    select?: TenantActivityLogSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TenantActivityLogs.
     */
    data: TenantActivityLogCreateManyInput | TenantActivityLogCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantActivityLogIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TenantActivityLog update
   */
  export type TenantActivityLogUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantActivityLog
     */
    select?: TenantActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantActivityLogInclude<ExtArgs> | null
    /**
     * The data needed to update a TenantActivityLog.
     */
    data: XOR<TenantActivityLogUpdateInput, TenantActivityLogUncheckedUpdateInput>
    /**
     * Choose, which TenantActivityLog to update.
     */
    where: TenantActivityLogWhereUniqueInput
  }

  /**
   * TenantActivityLog updateMany
   */
  export type TenantActivityLogUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TenantActivityLogs.
     */
    data: XOR<TenantActivityLogUpdateManyMutationInput, TenantActivityLogUncheckedUpdateManyInput>
    /**
     * Filter which TenantActivityLogs to update
     */
    where?: TenantActivityLogWhereInput
  }

  /**
   * TenantActivityLog upsert
   */
  export type TenantActivityLogUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantActivityLog
     */
    select?: TenantActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantActivityLogInclude<ExtArgs> | null
    /**
     * The filter to search for the TenantActivityLog to update in case it exists.
     */
    where: TenantActivityLogWhereUniqueInput
    /**
     * In case the TenantActivityLog found by the `where` argument doesn't exist, create a new TenantActivityLog with this data.
     */
    create: XOR<TenantActivityLogCreateInput, TenantActivityLogUncheckedCreateInput>
    /**
     * In case the TenantActivityLog was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantActivityLogUpdateInput, TenantActivityLogUncheckedUpdateInput>
  }

  /**
   * TenantActivityLog delete
   */
  export type TenantActivityLogDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantActivityLog
     */
    select?: TenantActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantActivityLogInclude<ExtArgs> | null
    /**
     * Filter which TenantActivityLog to delete.
     */
    where: TenantActivityLogWhereUniqueInput
  }

  /**
   * TenantActivityLog deleteMany
   */
  export type TenantActivityLogDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantActivityLogs to delete
     */
    where?: TenantActivityLogWhereInput
  }

  /**
   * TenantActivityLog.superAdmin
   */
  export type TenantActivityLog$superAdminArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SuperAdmin
     */
    select?: SuperAdminSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SuperAdminInclude<ExtArgs> | null
    where?: SuperAdminWhereInput
  }

  /**
   * TenantActivityLog without action
   */
  export type TenantActivityLogDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantActivityLog
     */
    select?: TenantActivityLogSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantActivityLogInclude<ExtArgs> | null
  }


  /**
   * Model TenantMetrics
   */

  export type AggregateTenantMetrics = {
    _count: TenantMetricsCountAggregateOutputType | null
    _avg: TenantMetricsAvgAggregateOutputType | null
    _sum: TenantMetricsSumAggregateOutputType | null
    _min: TenantMetricsMinAggregateOutputType | null
    _max: TenantMetricsMaxAggregateOutputType | null
  }

  export type TenantMetricsAvgAggregateOutputType = {
    totalRevenue: number | null
    totalOrders: number | null
    activeUsers: number | null
    activeLocations: number | null
  }

  export type TenantMetricsSumAggregateOutputType = {
    totalRevenue: number | null
    totalOrders: number | null
    activeUsers: number | null
    activeLocations: number | null
  }

  export type TenantMetricsMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    date: Date | null
    totalRevenue: number | null
    totalOrders: number | null
    activeUsers: number | null
    activeLocations: number | null
    createdAt: Date | null
  }

  export type TenantMetricsMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    date: Date | null
    totalRevenue: number | null
    totalOrders: number | null
    activeUsers: number | null
    activeLocations: number | null
    createdAt: Date | null
  }

  export type TenantMetricsCountAggregateOutputType = {
    id: number
    tenantId: number
    date: number
    totalRevenue: number
    totalOrders: number
    activeUsers: number
    activeLocations: number
    createdAt: number
    _all: number
  }


  export type TenantMetricsAvgAggregateInputType = {
    totalRevenue?: true
    totalOrders?: true
    activeUsers?: true
    activeLocations?: true
  }

  export type TenantMetricsSumAggregateInputType = {
    totalRevenue?: true
    totalOrders?: true
    activeUsers?: true
    activeLocations?: true
  }

  export type TenantMetricsMinAggregateInputType = {
    id?: true
    tenantId?: true
    date?: true
    totalRevenue?: true
    totalOrders?: true
    activeUsers?: true
    activeLocations?: true
    createdAt?: true
  }

  export type TenantMetricsMaxAggregateInputType = {
    id?: true
    tenantId?: true
    date?: true
    totalRevenue?: true
    totalOrders?: true
    activeUsers?: true
    activeLocations?: true
    createdAt?: true
  }

  export type TenantMetricsCountAggregateInputType = {
    id?: true
    tenantId?: true
    date?: true
    totalRevenue?: true
    totalOrders?: true
    activeUsers?: true
    activeLocations?: true
    createdAt?: true
    _all?: true
  }

  export type TenantMetricsAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantMetrics to aggregate.
     */
    where?: TenantMetricsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantMetrics to fetch.
     */
    orderBy?: TenantMetricsOrderByWithRelationInput | TenantMetricsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantMetricsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TenantMetrics
    **/
    _count?: true | TenantMetricsCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TenantMetricsAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TenantMetricsSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantMetricsMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantMetricsMaxAggregateInputType
  }

  export type GetTenantMetricsAggregateType<T extends TenantMetricsAggregateArgs> = {
        [P in keyof T & keyof AggregateTenantMetrics]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenantMetrics[P]>
      : GetScalarType<T[P], AggregateTenantMetrics[P]>
  }




  export type TenantMetricsGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantMetricsWhereInput
    orderBy?: TenantMetricsOrderByWithAggregationInput | TenantMetricsOrderByWithAggregationInput[]
    by: TenantMetricsScalarFieldEnum[] | TenantMetricsScalarFieldEnum
    having?: TenantMetricsScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantMetricsCountAggregateInputType | true
    _avg?: TenantMetricsAvgAggregateInputType
    _sum?: TenantMetricsSumAggregateInputType
    _min?: TenantMetricsMinAggregateInputType
    _max?: TenantMetricsMaxAggregateInputType
  }

  export type TenantMetricsGroupByOutputType = {
    id: string
    tenantId: string
    date: Date
    totalRevenue: number
    totalOrders: number
    activeUsers: number
    activeLocations: number
    createdAt: Date
    _count: TenantMetricsCountAggregateOutputType | null
    _avg: TenantMetricsAvgAggregateOutputType | null
    _sum: TenantMetricsSumAggregateOutputType | null
    _min: TenantMetricsMinAggregateOutputType | null
    _max: TenantMetricsMaxAggregateOutputType | null
  }

  type GetTenantMetricsGroupByPayload<T extends TenantMetricsGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantMetricsGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantMetricsGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantMetricsGroupByOutputType[P]>
            : GetScalarType<T[P], TenantMetricsGroupByOutputType[P]>
        }
      >
    >


  export type TenantMetricsSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    date?: boolean
    totalRevenue?: boolean
    totalOrders?: boolean
    activeUsers?: boolean
    activeLocations?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantMetrics"]>

  export type TenantMetricsSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    date?: boolean
    totalRevenue?: boolean
    totalOrders?: boolean
    activeUsers?: boolean
    activeLocations?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantMetrics"]>

  export type TenantMetricsSelectScalar = {
    id?: boolean
    tenantId?: boolean
    date?: boolean
    totalRevenue?: boolean
    totalOrders?: boolean
    activeUsers?: boolean
    activeLocations?: boolean
    createdAt?: boolean
  }

  export type TenantMetricsInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type TenantMetricsIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $TenantMetricsPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TenantMetrics"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      date: Date
      totalRevenue: number
      totalOrders: number
      activeUsers: number
      activeLocations: number
      createdAt: Date
    }, ExtArgs["result"]["tenantMetrics"]>
    composites: {}
  }

  type TenantMetricsGetPayload<S extends boolean | null | undefined | TenantMetricsDefaultArgs> = $Result.GetResult<Prisma.$TenantMetricsPayload, S>

  type TenantMetricsCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TenantMetricsFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TenantMetricsCountAggregateInputType | true
    }

  export interface TenantMetricsDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TenantMetrics'], meta: { name: 'TenantMetrics' } }
    /**
     * Find zero or one TenantMetrics that matches the filter.
     * @param {TenantMetricsFindUniqueArgs} args - Arguments to find a TenantMetrics
     * @example
     * // Get one TenantMetrics
     * const tenantMetrics = await prisma.tenantMetrics.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TenantMetricsFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, TenantMetricsFindUniqueArgs<ExtArgs>>
    ): Prisma__TenantMetricsClient<$Result.GetResult<Prisma.$TenantMetricsPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one TenantMetrics that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TenantMetricsFindUniqueOrThrowArgs} args - Arguments to find a TenantMetrics
     * @example
     * // Get one TenantMetrics
     * const tenantMetrics = await prisma.tenantMetrics.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends TenantMetricsFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantMetricsFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__TenantMetricsClient<$Result.GetResult<Prisma.$TenantMetricsPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first TenantMetrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantMetricsFindFirstArgs} args - Arguments to find a TenantMetrics
     * @example
     * // Get one TenantMetrics
     * const tenantMetrics = await prisma.tenantMetrics.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TenantMetricsFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantMetricsFindFirstArgs<ExtArgs>>
    ): Prisma__TenantMetricsClient<$Result.GetResult<Prisma.$TenantMetricsPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first TenantMetrics that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantMetricsFindFirstOrThrowArgs} args - Arguments to find a TenantMetrics
     * @example
     * // Get one TenantMetrics
     * const tenantMetrics = await prisma.tenantMetrics.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends TenantMetricsFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantMetricsFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__TenantMetricsClient<$Result.GetResult<Prisma.$TenantMetricsPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more TenantMetrics that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantMetricsFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TenantMetrics
     * const tenantMetrics = await prisma.tenantMetrics.findMany()
     * 
     * // Get first 10 TenantMetrics
     * const tenantMetrics = await prisma.tenantMetrics.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantMetricsWithIdOnly = await prisma.tenantMetrics.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends TenantMetricsFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantMetricsFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantMetricsPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a TenantMetrics.
     * @param {TenantMetricsCreateArgs} args - Arguments to create a TenantMetrics.
     * @example
     * // Create one TenantMetrics
     * const TenantMetrics = await prisma.tenantMetrics.create({
     *   data: {
     *     // ... data to create a TenantMetrics
     *   }
     * })
     * 
    **/
    create<T extends TenantMetricsCreateArgs<ExtArgs>>(
      args: SelectSubset<T, TenantMetricsCreateArgs<ExtArgs>>
    ): Prisma__TenantMetricsClient<$Result.GetResult<Prisma.$TenantMetricsPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many TenantMetrics.
     * @param {TenantMetricsCreateManyArgs} args - Arguments to create many TenantMetrics.
     * @example
     * // Create many TenantMetrics
     * const tenantMetrics = await prisma.tenantMetrics.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends TenantMetricsCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantMetricsCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TenantMetrics and returns the data saved in the database.
     * @param {TenantMetricsCreateManyAndReturnArgs} args - Arguments to create many TenantMetrics.
     * @example
     * // Create many TenantMetrics
     * const tenantMetrics = await prisma.tenantMetrics.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TenantMetrics and only return the `id`
     * const tenantMetricsWithIdOnly = await prisma.tenantMetrics.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends TenantMetricsCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantMetricsCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantMetricsPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a TenantMetrics.
     * @param {TenantMetricsDeleteArgs} args - Arguments to delete one TenantMetrics.
     * @example
     * // Delete one TenantMetrics
     * const TenantMetrics = await prisma.tenantMetrics.delete({
     *   where: {
     *     // ... filter to delete one TenantMetrics
     *   }
     * })
     * 
    **/
    delete<T extends TenantMetricsDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, TenantMetricsDeleteArgs<ExtArgs>>
    ): Prisma__TenantMetricsClient<$Result.GetResult<Prisma.$TenantMetricsPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one TenantMetrics.
     * @param {TenantMetricsUpdateArgs} args - Arguments to update one TenantMetrics.
     * @example
     * // Update one TenantMetrics
     * const tenantMetrics = await prisma.tenantMetrics.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TenantMetricsUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, TenantMetricsUpdateArgs<ExtArgs>>
    ): Prisma__TenantMetricsClient<$Result.GetResult<Prisma.$TenantMetricsPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more TenantMetrics.
     * @param {TenantMetricsDeleteManyArgs} args - Arguments to filter TenantMetrics to delete.
     * @example
     * // Delete a few TenantMetrics
     * const { count } = await prisma.tenantMetrics.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TenantMetricsDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantMetricsDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantMetricsUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TenantMetrics
     * const tenantMetrics = await prisma.tenantMetrics.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TenantMetricsUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, TenantMetricsUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TenantMetrics.
     * @param {TenantMetricsUpsertArgs} args - Arguments to update or create a TenantMetrics.
     * @example
     * // Update or create a TenantMetrics
     * const tenantMetrics = await prisma.tenantMetrics.upsert({
     *   create: {
     *     // ... data to create a TenantMetrics
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TenantMetrics we want to update
     *   }
     * })
    **/
    upsert<T extends TenantMetricsUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, TenantMetricsUpsertArgs<ExtArgs>>
    ): Prisma__TenantMetricsClient<$Result.GetResult<Prisma.$TenantMetricsPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of TenantMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantMetricsCountArgs} args - Arguments to filter TenantMetrics to count.
     * @example
     * // Count the number of TenantMetrics
     * const count = await prisma.tenantMetrics.count({
     *   where: {
     *     // ... the filter for the TenantMetrics we want to count
     *   }
     * })
    **/
    count<T extends TenantMetricsCountArgs>(
      args?: Subset<T, TenantMetricsCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantMetricsCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TenantMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantMetricsAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantMetricsAggregateArgs>(args: Subset<T, TenantMetricsAggregateArgs>): Prisma.PrismaPromise<GetTenantMetricsAggregateType<T>>

    /**
     * Group by TenantMetrics.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantMetricsGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantMetricsGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantMetricsGroupByArgs['orderBy'] }
        : { orderBy?: TenantMetricsGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantMetricsGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantMetricsGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TenantMetrics model
   */
  readonly fields: TenantMetricsFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TenantMetrics.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantMetricsClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the TenantMetrics model
   */ 
  interface TenantMetricsFieldRefs {
    readonly id: FieldRef<"TenantMetrics", 'String'>
    readonly tenantId: FieldRef<"TenantMetrics", 'String'>
    readonly date: FieldRef<"TenantMetrics", 'DateTime'>
    readonly totalRevenue: FieldRef<"TenantMetrics", 'Float'>
    readonly totalOrders: FieldRef<"TenantMetrics", 'Int'>
    readonly activeUsers: FieldRef<"TenantMetrics", 'Int'>
    readonly activeLocations: FieldRef<"TenantMetrics", 'Int'>
    readonly createdAt: FieldRef<"TenantMetrics", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TenantMetrics findUnique
   */
  export type TenantMetricsFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMetrics
     */
    select?: TenantMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantMetricsInclude<ExtArgs> | null
    /**
     * Filter, which TenantMetrics to fetch.
     */
    where: TenantMetricsWhereUniqueInput
  }

  /**
   * TenantMetrics findUniqueOrThrow
   */
  export type TenantMetricsFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMetrics
     */
    select?: TenantMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantMetricsInclude<ExtArgs> | null
    /**
     * Filter, which TenantMetrics to fetch.
     */
    where: TenantMetricsWhereUniqueInput
  }

  /**
   * TenantMetrics findFirst
   */
  export type TenantMetricsFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMetrics
     */
    select?: TenantMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantMetricsInclude<ExtArgs> | null
    /**
     * Filter, which TenantMetrics to fetch.
     */
    where?: TenantMetricsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantMetrics to fetch.
     */
    orderBy?: TenantMetricsOrderByWithRelationInput | TenantMetricsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantMetrics.
     */
    cursor?: TenantMetricsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantMetrics.
     */
    distinct?: TenantMetricsScalarFieldEnum | TenantMetricsScalarFieldEnum[]
  }

  /**
   * TenantMetrics findFirstOrThrow
   */
  export type TenantMetricsFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMetrics
     */
    select?: TenantMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantMetricsInclude<ExtArgs> | null
    /**
     * Filter, which TenantMetrics to fetch.
     */
    where?: TenantMetricsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantMetrics to fetch.
     */
    orderBy?: TenantMetricsOrderByWithRelationInput | TenantMetricsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantMetrics.
     */
    cursor?: TenantMetricsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantMetrics.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantMetrics.
     */
    distinct?: TenantMetricsScalarFieldEnum | TenantMetricsScalarFieldEnum[]
  }

  /**
   * TenantMetrics findMany
   */
  export type TenantMetricsFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMetrics
     */
    select?: TenantMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantMetricsInclude<ExtArgs> | null
    /**
     * Filter, which TenantMetrics to fetch.
     */
    where?: TenantMetricsWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantMetrics to fetch.
     */
    orderBy?: TenantMetricsOrderByWithRelationInput | TenantMetricsOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TenantMetrics.
     */
    cursor?: TenantMetricsWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantMetrics from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantMetrics.
     */
    skip?: number
    distinct?: TenantMetricsScalarFieldEnum | TenantMetricsScalarFieldEnum[]
  }

  /**
   * TenantMetrics create
   */
  export type TenantMetricsCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMetrics
     */
    select?: TenantMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantMetricsInclude<ExtArgs> | null
    /**
     * The data needed to create a TenantMetrics.
     */
    data: XOR<TenantMetricsCreateInput, TenantMetricsUncheckedCreateInput>
  }

  /**
   * TenantMetrics createMany
   */
  export type TenantMetricsCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TenantMetrics.
     */
    data: TenantMetricsCreateManyInput | TenantMetricsCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TenantMetrics createManyAndReturn
   */
  export type TenantMetricsCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMetrics
     */
    select?: TenantMetricsSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TenantMetrics.
     */
    data: TenantMetricsCreateManyInput | TenantMetricsCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantMetricsIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TenantMetrics update
   */
  export type TenantMetricsUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMetrics
     */
    select?: TenantMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantMetricsInclude<ExtArgs> | null
    /**
     * The data needed to update a TenantMetrics.
     */
    data: XOR<TenantMetricsUpdateInput, TenantMetricsUncheckedUpdateInput>
    /**
     * Choose, which TenantMetrics to update.
     */
    where: TenantMetricsWhereUniqueInput
  }

  /**
   * TenantMetrics updateMany
   */
  export type TenantMetricsUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TenantMetrics.
     */
    data: XOR<TenantMetricsUpdateManyMutationInput, TenantMetricsUncheckedUpdateManyInput>
    /**
     * Filter which TenantMetrics to update
     */
    where?: TenantMetricsWhereInput
  }

  /**
   * TenantMetrics upsert
   */
  export type TenantMetricsUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMetrics
     */
    select?: TenantMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantMetricsInclude<ExtArgs> | null
    /**
     * The filter to search for the TenantMetrics to update in case it exists.
     */
    where: TenantMetricsWhereUniqueInput
    /**
     * In case the TenantMetrics found by the `where` argument doesn't exist, create a new TenantMetrics with this data.
     */
    create: XOR<TenantMetricsCreateInput, TenantMetricsUncheckedCreateInput>
    /**
     * In case the TenantMetrics was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantMetricsUpdateInput, TenantMetricsUncheckedUpdateInput>
  }

  /**
   * TenantMetrics delete
   */
  export type TenantMetricsDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMetrics
     */
    select?: TenantMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantMetricsInclude<ExtArgs> | null
    /**
     * Filter which TenantMetrics to delete.
     */
    where: TenantMetricsWhereUniqueInput
  }

  /**
   * TenantMetrics deleteMany
   */
  export type TenantMetricsDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantMetrics to delete
     */
    where?: TenantMetricsWhereInput
  }

  /**
   * TenantMetrics without action
   */
  export type TenantMetricsDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantMetrics
     */
    select?: TenantMetricsSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantMetricsInclude<ExtArgs> | null
  }


  /**
   * Model TenantUsage
   */

  export type AggregateTenantUsage = {
    _count: TenantUsageCountAggregateOutputType | null
    _avg: TenantUsageAvgAggregateOutputType | null
    _sum: TenantUsageSumAggregateOutputType | null
    _min: TenantUsageMinAggregateOutputType | null
    _max: TenantUsageMaxAggregateOutputType | null
  }

  export type TenantUsageAvgAggregateOutputType = {
    dbSizeMB: number | null
    dbSizeBytes: number | null
    apiRequests: number | null
    storageSizeMB: number | null
    overageAmount: number | null
  }

  export type TenantUsageSumAggregateOutputType = {
    dbSizeMB: number | null
    dbSizeBytes: bigint | null
    apiRequests: number | null
    storageSizeMB: number | null
    overageAmount: number | null
  }

  export type TenantUsageMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    date: Date | null
    dbSizeMB: number | null
    dbSizeBytes: bigint | null
    apiRequests: number | null
    storageSizeMB: number | null
    dbOverage: boolean | null
    apiOverage: boolean | null
    overageAmount: number | null
    recordedAt: Date | null
    createdAt: Date | null
  }

  export type TenantUsageMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    date: Date | null
    dbSizeMB: number | null
    dbSizeBytes: bigint | null
    apiRequests: number | null
    storageSizeMB: number | null
    dbOverage: boolean | null
    apiOverage: boolean | null
    overageAmount: number | null
    recordedAt: Date | null
    createdAt: Date | null
  }

  export type TenantUsageCountAggregateOutputType = {
    id: number
    tenantId: number
    date: number
    dbSizeMB: number
    dbSizeBytes: number
    apiRequests: number
    apiRequestsByEndpoint: number
    storageSizeMB: number
    dbOverage: number
    apiOverage: number
    overageAmount: number
    recordedAt: number
    createdAt: number
    _all: number
  }


  export type TenantUsageAvgAggregateInputType = {
    dbSizeMB?: true
    dbSizeBytes?: true
    apiRequests?: true
    storageSizeMB?: true
    overageAmount?: true
  }

  export type TenantUsageSumAggregateInputType = {
    dbSizeMB?: true
    dbSizeBytes?: true
    apiRequests?: true
    storageSizeMB?: true
    overageAmount?: true
  }

  export type TenantUsageMinAggregateInputType = {
    id?: true
    tenantId?: true
    date?: true
    dbSizeMB?: true
    dbSizeBytes?: true
    apiRequests?: true
    storageSizeMB?: true
    dbOverage?: true
    apiOverage?: true
    overageAmount?: true
    recordedAt?: true
    createdAt?: true
  }

  export type TenantUsageMaxAggregateInputType = {
    id?: true
    tenantId?: true
    date?: true
    dbSizeMB?: true
    dbSizeBytes?: true
    apiRequests?: true
    storageSizeMB?: true
    dbOverage?: true
    apiOverage?: true
    overageAmount?: true
    recordedAt?: true
    createdAt?: true
  }

  export type TenantUsageCountAggregateInputType = {
    id?: true
    tenantId?: true
    date?: true
    dbSizeMB?: true
    dbSizeBytes?: true
    apiRequests?: true
    apiRequestsByEndpoint?: true
    storageSizeMB?: true
    dbOverage?: true
    apiOverage?: true
    overageAmount?: true
    recordedAt?: true
    createdAt?: true
    _all?: true
  }

  export type TenantUsageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantUsage to aggregate.
     */
    where?: TenantUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUsages to fetch.
     */
    orderBy?: TenantUsageOrderByWithRelationInput | TenantUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TenantUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned TenantUsages
    **/
    _count?: true | TenantUsageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TenantUsageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TenantUsageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TenantUsageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TenantUsageMaxAggregateInputType
  }

  export type GetTenantUsageAggregateType<T extends TenantUsageAggregateArgs> = {
        [P in keyof T & keyof AggregateTenantUsage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTenantUsage[P]>
      : GetScalarType<T[P], AggregateTenantUsage[P]>
  }




  export type TenantUsageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TenantUsageWhereInput
    orderBy?: TenantUsageOrderByWithAggregationInput | TenantUsageOrderByWithAggregationInput[]
    by: TenantUsageScalarFieldEnum[] | TenantUsageScalarFieldEnum
    having?: TenantUsageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TenantUsageCountAggregateInputType | true
    _avg?: TenantUsageAvgAggregateInputType
    _sum?: TenantUsageSumAggregateInputType
    _min?: TenantUsageMinAggregateInputType
    _max?: TenantUsageMaxAggregateInputType
  }

  export type TenantUsageGroupByOutputType = {
    id: string
    tenantId: string
    date: Date
    dbSizeMB: number
    dbSizeBytes: bigint
    apiRequests: number
    apiRequestsByEndpoint: JsonValue | null
    storageSizeMB: number
    dbOverage: boolean
    apiOverage: boolean
    overageAmount: number | null
    recordedAt: Date
    createdAt: Date
    _count: TenantUsageCountAggregateOutputType | null
    _avg: TenantUsageAvgAggregateOutputType | null
    _sum: TenantUsageSumAggregateOutputType | null
    _min: TenantUsageMinAggregateOutputType | null
    _max: TenantUsageMaxAggregateOutputType | null
  }

  type GetTenantUsageGroupByPayload<T extends TenantUsageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TenantUsageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TenantUsageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TenantUsageGroupByOutputType[P]>
            : GetScalarType<T[P], TenantUsageGroupByOutputType[P]>
        }
      >
    >


  export type TenantUsageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    date?: boolean
    dbSizeMB?: boolean
    dbSizeBytes?: boolean
    apiRequests?: boolean
    apiRequestsByEndpoint?: boolean
    storageSizeMB?: boolean
    dbOverage?: boolean
    apiOverage?: boolean
    overageAmount?: boolean
    recordedAt?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantUsage"]>

  export type TenantUsageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    date?: boolean
    dbSizeMB?: boolean
    dbSizeBytes?: boolean
    apiRequests?: boolean
    apiRequestsByEndpoint?: boolean
    storageSizeMB?: boolean
    dbOverage?: boolean
    apiOverage?: boolean
    overageAmount?: boolean
    recordedAt?: boolean
    createdAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["tenantUsage"]>

  export type TenantUsageSelectScalar = {
    id?: boolean
    tenantId?: boolean
    date?: boolean
    dbSizeMB?: boolean
    dbSizeBytes?: boolean
    apiRequests?: boolean
    apiRequestsByEndpoint?: boolean
    storageSizeMB?: boolean
    dbOverage?: boolean
    apiOverage?: boolean
    overageAmount?: boolean
    recordedAt?: boolean
    createdAt?: boolean
  }

  export type TenantUsageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type TenantUsageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $TenantUsagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "TenantUsage"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      date: Date
      dbSizeMB: number
      dbSizeBytes: bigint
      apiRequests: number
      apiRequestsByEndpoint: Prisma.JsonValue | null
      storageSizeMB: number
      dbOverage: boolean
      apiOverage: boolean
      overageAmount: number | null
      recordedAt: Date
      createdAt: Date
    }, ExtArgs["result"]["tenantUsage"]>
    composites: {}
  }

  type TenantUsageGetPayload<S extends boolean | null | undefined | TenantUsageDefaultArgs> = $Result.GetResult<Prisma.$TenantUsagePayload, S>

  type TenantUsageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TenantUsageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TenantUsageCountAggregateInputType | true
    }

  export interface TenantUsageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['TenantUsage'], meta: { name: 'TenantUsage' } }
    /**
     * Find zero or one TenantUsage that matches the filter.
     * @param {TenantUsageFindUniqueArgs} args - Arguments to find a TenantUsage
     * @example
     * // Get one TenantUsage
     * const tenantUsage = await prisma.tenantUsage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends TenantUsageFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, TenantUsageFindUniqueArgs<ExtArgs>>
    ): Prisma__TenantUsageClient<$Result.GetResult<Prisma.$TenantUsagePayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one TenantUsage that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TenantUsageFindUniqueOrThrowArgs} args - Arguments to find a TenantUsage
     * @example
     * // Get one TenantUsage
     * const tenantUsage = await prisma.tenantUsage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends TenantUsageFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantUsageFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__TenantUsageClient<$Result.GetResult<Prisma.$TenantUsagePayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first TenantUsage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUsageFindFirstArgs} args - Arguments to find a TenantUsage
     * @example
     * // Get one TenantUsage
     * const tenantUsage = await prisma.tenantUsage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends TenantUsageFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantUsageFindFirstArgs<ExtArgs>>
    ): Prisma__TenantUsageClient<$Result.GetResult<Prisma.$TenantUsagePayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first TenantUsage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUsageFindFirstOrThrowArgs} args - Arguments to find a TenantUsage
     * @example
     * // Get one TenantUsage
     * const tenantUsage = await prisma.tenantUsage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends TenantUsageFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantUsageFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__TenantUsageClient<$Result.GetResult<Prisma.$TenantUsagePayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more TenantUsages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUsageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all TenantUsages
     * const tenantUsages = await prisma.tenantUsage.findMany()
     * 
     * // Get first 10 TenantUsages
     * const tenantUsages = await prisma.tenantUsage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const tenantUsageWithIdOnly = await prisma.tenantUsage.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends TenantUsageFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantUsageFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantUsagePayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a TenantUsage.
     * @param {TenantUsageCreateArgs} args - Arguments to create a TenantUsage.
     * @example
     * // Create one TenantUsage
     * const TenantUsage = await prisma.tenantUsage.create({
     *   data: {
     *     // ... data to create a TenantUsage
     *   }
     * })
     * 
    **/
    create<T extends TenantUsageCreateArgs<ExtArgs>>(
      args: SelectSubset<T, TenantUsageCreateArgs<ExtArgs>>
    ): Prisma__TenantUsageClient<$Result.GetResult<Prisma.$TenantUsagePayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many TenantUsages.
     * @param {TenantUsageCreateManyArgs} args - Arguments to create many TenantUsages.
     * @example
     * // Create many TenantUsages
     * const tenantUsage = await prisma.tenantUsage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends TenantUsageCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantUsageCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many TenantUsages and returns the data saved in the database.
     * @param {TenantUsageCreateManyAndReturnArgs} args - Arguments to create many TenantUsages.
     * @example
     * // Create many TenantUsages
     * const tenantUsage = await prisma.tenantUsage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many TenantUsages and only return the `id`
     * const tenantUsageWithIdOnly = await prisma.tenantUsage.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends TenantUsageCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantUsageCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TenantUsagePayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a TenantUsage.
     * @param {TenantUsageDeleteArgs} args - Arguments to delete one TenantUsage.
     * @example
     * // Delete one TenantUsage
     * const TenantUsage = await prisma.tenantUsage.delete({
     *   where: {
     *     // ... filter to delete one TenantUsage
     *   }
     * })
     * 
    **/
    delete<T extends TenantUsageDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, TenantUsageDeleteArgs<ExtArgs>>
    ): Prisma__TenantUsageClient<$Result.GetResult<Prisma.$TenantUsagePayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one TenantUsage.
     * @param {TenantUsageUpdateArgs} args - Arguments to update one TenantUsage.
     * @example
     * // Update one TenantUsage
     * const tenantUsage = await prisma.tenantUsage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends TenantUsageUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, TenantUsageUpdateArgs<ExtArgs>>
    ): Prisma__TenantUsageClient<$Result.GetResult<Prisma.$TenantUsagePayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more TenantUsages.
     * @param {TenantUsageDeleteManyArgs} args - Arguments to filter TenantUsages to delete.
     * @example
     * // Delete a few TenantUsages
     * const { count } = await prisma.tenantUsage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends TenantUsageDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, TenantUsageDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more TenantUsages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUsageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many TenantUsages
     * const tenantUsage = await prisma.tenantUsage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends TenantUsageUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, TenantUsageUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one TenantUsage.
     * @param {TenantUsageUpsertArgs} args - Arguments to update or create a TenantUsage.
     * @example
     * // Update or create a TenantUsage
     * const tenantUsage = await prisma.tenantUsage.upsert({
     *   create: {
     *     // ... data to create a TenantUsage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the TenantUsage we want to update
     *   }
     * })
    **/
    upsert<T extends TenantUsageUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, TenantUsageUpsertArgs<ExtArgs>>
    ): Prisma__TenantUsageClient<$Result.GetResult<Prisma.$TenantUsagePayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of TenantUsages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUsageCountArgs} args - Arguments to filter TenantUsages to count.
     * @example
     * // Count the number of TenantUsages
     * const count = await prisma.tenantUsage.count({
     *   where: {
     *     // ... the filter for the TenantUsages we want to count
     *   }
     * })
    **/
    count<T extends TenantUsageCountArgs>(
      args?: Subset<T, TenantUsageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TenantUsageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a TenantUsage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUsageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TenantUsageAggregateArgs>(args: Subset<T, TenantUsageAggregateArgs>): Prisma.PrismaPromise<GetTenantUsageAggregateType<T>>

    /**
     * Group by TenantUsage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TenantUsageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TenantUsageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TenantUsageGroupByArgs['orderBy'] }
        : { orderBy?: TenantUsageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TenantUsageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTenantUsageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the TenantUsage model
   */
  readonly fields: TenantUsageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for TenantUsage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TenantUsageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the TenantUsage model
   */ 
  interface TenantUsageFieldRefs {
    readonly id: FieldRef<"TenantUsage", 'String'>
    readonly tenantId: FieldRef<"TenantUsage", 'String'>
    readonly date: FieldRef<"TenantUsage", 'DateTime'>
    readonly dbSizeMB: FieldRef<"TenantUsage", 'Float'>
    readonly dbSizeBytes: FieldRef<"TenantUsage", 'BigInt'>
    readonly apiRequests: FieldRef<"TenantUsage", 'Int'>
    readonly apiRequestsByEndpoint: FieldRef<"TenantUsage", 'Json'>
    readonly storageSizeMB: FieldRef<"TenantUsage", 'Float'>
    readonly dbOverage: FieldRef<"TenantUsage", 'Boolean'>
    readonly apiOverage: FieldRef<"TenantUsage", 'Boolean'>
    readonly overageAmount: FieldRef<"TenantUsage", 'Float'>
    readonly recordedAt: FieldRef<"TenantUsage", 'DateTime'>
    readonly createdAt: FieldRef<"TenantUsage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * TenantUsage findUnique
   */
  export type TenantUsageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsage
     */
    select?: TenantUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUsageInclude<ExtArgs> | null
    /**
     * Filter, which TenantUsage to fetch.
     */
    where: TenantUsageWhereUniqueInput
  }

  /**
   * TenantUsage findUniqueOrThrow
   */
  export type TenantUsageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsage
     */
    select?: TenantUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUsageInclude<ExtArgs> | null
    /**
     * Filter, which TenantUsage to fetch.
     */
    where: TenantUsageWhereUniqueInput
  }

  /**
   * TenantUsage findFirst
   */
  export type TenantUsageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsage
     */
    select?: TenantUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUsageInclude<ExtArgs> | null
    /**
     * Filter, which TenantUsage to fetch.
     */
    where?: TenantUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUsages to fetch.
     */
    orderBy?: TenantUsageOrderByWithRelationInput | TenantUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantUsages.
     */
    cursor?: TenantUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantUsages.
     */
    distinct?: TenantUsageScalarFieldEnum | TenantUsageScalarFieldEnum[]
  }

  /**
   * TenantUsage findFirstOrThrow
   */
  export type TenantUsageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsage
     */
    select?: TenantUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUsageInclude<ExtArgs> | null
    /**
     * Filter, which TenantUsage to fetch.
     */
    where?: TenantUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUsages to fetch.
     */
    orderBy?: TenantUsageOrderByWithRelationInput | TenantUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for TenantUsages.
     */
    cursor?: TenantUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUsages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of TenantUsages.
     */
    distinct?: TenantUsageScalarFieldEnum | TenantUsageScalarFieldEnum[]
  }

  /**
   * TenantUsage findMany
   */
  export type TenantUsageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsage
     */
    select?: TenantUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUsageInclude<ExtArgs> | null
    /**
     * Filter, which TenantUsages to fetch.
     */
    where?: TenantUsageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of TenantUsages to fetch.
     */
    orderBy?: TenantUsageOrderByWithRelationInput | TenantUsageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing TenantUsages.
     */
    cursor?: TenantUsageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` TenantUsages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` TenantUsages.
     */
    skip?: number
    distinct?: TenantUsageScalarFieldEnum | TenantUsageScalarFieldEnum[]
  }

  /**
   * TenantUsage create
   */
  export type TenantUsageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsage
     */
    select?: TenantUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUsageInclude<ExtArgs> | null
    /**
     * The data needed to create a TenantUsage.
     */
    data: XOR<TenantUsageCreateInput, TenantUsageUncheckedCreateInput>
  }

  /**
   * TenantUsage createMany
   */
  export type TenantUsageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many TenantUsages.
     */
    data: TenantUsageCreateManyInput | TenantUsageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * TenantUsage createManyAndReturn
   */
  export type TenantUsageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsage
     */
    select?: TenantUsageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many TenantUsages.
     */
    data: TenantUsageCreateManyInput | TenantUsageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUsageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * TenantUsage update
   */
  export type TenantUsageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsage
     */
    select?: TenantUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUsageInclude<ExtArgs> | null
    /**
     * The data needed to update a TenantUsage.
     */
    data: XOR<TenantUsageUpdateInput, TenantUsageUncheckedUpdateInput>
    /**
     * Choose, which TenantUsage to update.
     */
    where: TenantUsageWhereUniqueInput
  }

  /**
   * TenantUsage updateMany
   */
  export type TenantUsageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update TenantUsages.
     */
    data: XOR<TenantUsageUpdateManyMutationInput, TenantUsageUncheckedUpdateManyInput>
    /**
     * Filter which TenantUsages to update
     */
    where?: TenantUsageWhereInput
  }

  /**
   * TenantUsage upsert
   */
  export type TenantUsageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsage
     */
    select?: TenantUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUsageInclude<ExtArgs> | null
    /**
     * The filter to search for the TenantUsage to update in case it exists.
     */
    where: TenantUsageWhereUniqueInput
    /**
     * In case the TenantUsage found by the `where` argument doesn't exist, create a new TenantUsage with this data.
     */
    create: XOR<TenantUsageCreateInput, TenantUsageUncheckedCreateInput>
    /**
     * In case the TenantUsage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TenantUsageUpdateInput, TenantUsageUncheckedUpdateInput>
  }

  /**
   * TenantUsage delete
   */
  export type TenantUsageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsage
     */
    select?: TenantUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUsageInclude<ExtArgs> | null
    /**
     * Filter which TenantUsage to delete.
     */
    where: TenantUsageWhereUniqueInput
  }

  /**
   * TenantUsage deleteMany
   */
  export type TenantUsageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which TenantUsages to delete
     */
    where?: TenantUsageWhereInput
  }

  /**
   * TenantUsage without action
   */
  export type TenantUsageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the TenantUsage
     */
    select?: TenantUsageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TenantUsageInclude<ExtArgs> | null
  }


  /**
   * Model UsageAlert
   */

  export type AggregateUsageAlert = {
    _count: UsageAlertCountAggregateOutputType | null
    _avg: UsageAlertAvgAggregateOutputType | null
    _sum: UsageAlertSumAggregateOutputType | null
    _min: UsageAlertMinAggregateOutputType | null
    _max: UsageAlertMaxAggregateOutputType | null
  }

  export type UsageAlertAvgAggregateOutputType = {
    percentage: number | null
    current: number | null
    limit: number | null
  }

  export type UsageAlertSumAggregateOutputType = {
    percentage: number | null
    current: number | null
    limit: number | null
  }

  export type UsageAlertMinAggregateOutputType = {
    id: string | null
    tenantId: string | null
    resource: string | null
    level: string | null
    percentage: number | null
    current: number | null
    limit: number | null
    message: string | null
    isRead: boolean | null
    isSent: boolean | null
    sentAt: Date | null
    createdAt: Date | null
    resolvedAt: Date | null
  }

  export type UsageAlertMaxAggregateOutputType = {
    id: string | null
    tenantId: string | null
    resource: string | null
    level: string | null
    percentage: number | null
    current: number | null
    limit: number | null
    message: string | null
    isRead: boolean | null
    isSent: boolean | null
    sentAt: Date | null
    createdAt: Date | null
    resolvedAt: Date | null
  }

  export type UsageAlertCountAggregateOutputType = {
    id: number
    tenantId: number
    resource: number
    level: number
    percentage: number
    current: number
    limit: number
    message: number
    isRead: number
    isSent: number
    sentAt: number
    createdAt: number
    resolvedAt: number
    _all: number
  }


  export type UsageAlertAvgAggregateInputType = {
    percentage?: true
    current?: true
    limit?: true
  }

  export type UsageAlertSumAggregateInputType = {
    percentage?: true
    current?: true
    limit?: true
  }

  export type UsageAlertMinAggregateInputType = {
    id?: true
    tenantId?: true
    resource?: true
    level?: true
    percentage?: true
    current?: true
    limit?: true
    message?: true
    isRead?: true
    isSent?: true
    sentAt?: true
    createdAt?: true
    resolvedAt?: true
  }

  export type UsageAlertMaxAggregateInputType = {
    id?: true
    tenantId?: true
    resource?: true
    level?: true
    percentage?: true
    current?: true
    limit?: true
    message?: true
    isRead?: true
    isSent?: true
    sentAt?: true
    createdAt?: true
    resolvedAt?: true
  }

  export type UsageAlertCountAggregateInputType = {
    id?: true
    tenantId?: true
    resource?: true
    level?: true
    percentage?: true
    current?: true
    limit?: true
    message?: true
    isRead?: true
    isSent?: true
    sentAt?: true
    createdAt?: true
    resolvedAt?: true
    _all?: true
  }

  export type UsageAlertAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UsageAlert to aggregate.
     */
    where?: UsageAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageAlerts to fetch.
     */
    orderBy?: UsageAlertOrderByWithRelationInput | UsageAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UsageAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UsageAlerts
    **/
    _count?: true | UsageAlertCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: UsageAlertAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: UsageAlertSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UsageAlertMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UsageAlertMaxAggregateInputType
  }

  export type GetUsageAlertAggregateType<T extends UsageAlertAggregateArgs> = {
        [P in keyof T & keyof AggregateUsageAlert]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUsageAlert[P]>
      : GetScalarType<T[P], AggregateUsageAlert[P]>
  }




  export type UsageAlertGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UsageAlertWhereInput
    orderBy?: UsageAlertOrderByWithAggregationInput | UsageAlertOrderByWithAggregationInput[]
    by: UsageAlertScalarFieldEnum[] | UsageAlertScalarFieldEnum
    having?: UsageAlertScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UsageAlertCountAggregateInputType | true
    _avg?: UsageAlertAvgAggregateInputType
    _sum?: UsageAlertSumAggregateInputType
    _min?: UsageAlertMinAggregateInputType
    _max?: UsageAlertMaxAggregateInputType
  }

  export type UsageAlertGroupByOutputType = {
    id: string
    tenantId: string
    resource: string
    level: string
    percentage: number
    current: number
    limit: number
    message: string
    isRead: boolean
    isSent: boolean
    sentAt: Date | null
    createdAt: Date
    resolvedAt: Date | null
    _count: UsageAlertCountAggregateOutputType | null
    _avg: UsageAlertAvgAggregateOutputType | null
    _sum: UsageAlertSumAggregateOutputType | null
    _min: UsageAlertMinAggregateOutputType | null
    _max: UsageAlertMaxAggregateOutputType | null
  }

  type GetUsageAlertGroupByPayload<T extends UsageAlertGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UsageAlertGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UsageAlertGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UsageAlertGroupByOutputType[P]>
            : GetScalarType<T[P], UsageAlertGroupByOutputType[P]>
        }
      >
    >


  export type UsageAlertSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    resource?: boolean
    level?: boolean
    percentage?: boolean
    current?: boolean
    limit?: boolean
    message?: boolean
    isRead?: boolean
    isSent?: boolean
    sentAt?: boolean
    createdAt?: boolean
    resolvedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usageAlert"]>

  export type UsageAlertSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    tenantId?: boolean
    resource?: boolean
    level?: boolean
    percentage?: boolean
    current?: boolean
    limit?: boolean
    message?: boolean
    isRead?: boolean
    isSent?: boolean
    sentAt?: boolean
    createdAt?: boolean
    resolvedAt?: boolean
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["usageAlert"]>

  export type UsageAlertSelectScalar = {
    id?: boolean
    tenantId?: boolean
    resource?: boolean
    level?: boolean
    percentage?: boolean
    current?: boolean
    limit?: boolean
    message?: boolean
    isRead?: boolean
    isSent?: boolean
    sentAt?: boolean
    createdAt?: boolean
    resolvedAt?: boolean
  }

  export type UsageAlertInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }
  export type UsageAlertIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tenant?: boolean | TenantDefaultArgs<ExtArgs>
  }

  export type $UsageAlertPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UsageAlert"
    objects: {
      tenant: Prisma.$TenantPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      tenantId: string
      resource: string
      level: string
      percentage: number
      current: number
      limit: number
      message: string
      isRead: boolean
      isSent: boolean
      sentAt: Date | null
      createdAt: Date
      resolvedAt: Date | null
    }, ExtArgs["result"]["usageAlert"]>
    composites: {}
  }

  type UsageAlertGetPayload<S extends boolean | null | undefined | UsageAlertDefaultArgs> = $Result.GetResult<Prisma.$UsageAlertPayload, S>

  type UsageAlertCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UsageAlertFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UsageAlertCountAggregateInputType | true
    }

  export interface UsageAlertDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UsageAlert'], meta: { name: 'UsageAlert' } }
    /**
     * Find zero or one UsageAlert that matches the filter.
     * @param {UsageAlertFindUniqueArgs} args - Arguments to find a UsageAlert
     * @example
     * // Get one UsageAlert
     * const usageAlert = await prisma.usageAlert.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUnique<T extends UsageAlertFindUniqueArgs<ExtArgs>>(
      args: SelectSubset<T, UsageAlertFindUniqueArgs<ExtArgs>>
    ): Prisma__UsageAlertClient<$Result.GetResult<Prisma.$UsageAlertPayload<ExtArgs>, T, 'findUnique'> | null, null, ExtArgs>

    /**
     * Find one UsageAlert that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UsageAlertFindUniqueOrThrowArgs} args - Arguments to find a UsageAlert
     * @example
     * // Get one UsageAlert
     * const usageAlert = await prisma.usageAlert.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findUniqueOrThrow<T extends UsageAlertFindUniqueOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UsageAlertFindUniqueOrThrowArgs<ExtArgs>>
    ): Prisma__UsageAlertClient<$Result.GetResult<Prisma.$UsageAlertPayload<ExtArgs>, T, 'findUniqueOrThrow'>, never, ExtArgs>

    /**
     * Find the first UsageAlert that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageAlertFindFirstArgs} args - Arguments to find a UsageAlert
     * @example
     * // Get one UsageAlert
     * const usageAlert = await prisma.usageAlert.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirst<T extends UsageAlertFindFirstArgs<ExtArgs>>(
      args?: SelectSubset<T, UsageAlertFindFirstArgs<ExtArgs>>
    ): Prisma__UsageAlertClient<$Result.GetResult<Prisma.$UsageAlertPayload<ExtArgs>, T, 'findFirst'> | null, null, ExtArgs>

    /**
     * Find the first UsageAlert that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageAlertFindFirstOrThrowArgs} args - Arguments to find a UsageAlert
     * @example
     * // Get one UsageAlert
     * const usageAlert = await prisma.usageAlert.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
    **/
    findFirstOrThrow<T extends UsageAlertFindFirstOrThrowArgs<ExtArgs>>(
      args?: SelectSubset<T, UsageAlertFindFirstOrThrowArgs<ExtArgs>>
    ): Prisma__UsageAlertClient<$Result.GetResult<Prisma.$UsageAlertPayload<ExtArgs>, T, 'findFirstOrThrow'>, never, ExtArgs>

    /**
     * Find zero or more UsageAlerts that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageAlertFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UsageAlerts
     * const usageAlerts = await prisma.usageAlert.findMany()
     * 
     * // Get first 10 UsageAlerts
     * const usageAlerts = await prisma.usageAlert.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const usageAlertWithIdOnly = await prisma.usageAlert.findMany({ select: { id: true } })
     * 
    **/
    findMany<T extends UsageAlertFindManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UsageAlertFindManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageAlertPayload<ExtArgs>, T, 'findMany'>>

    /**
     * Create a UsageAlert.
     * @param {UsageAlertCreateArgs} args - Arguments to create a UsageAlert.
     * @example
     * // Create one UsageAlert
     * const UsageAlert = await prisma.usageAlert.create({
     *   data: {
     *     // ... data to create a UsageAlert
     *   }
     * })
     * 
    **/
    create<T extends UsageAlertCreateArgs<ExtArgs>>(
      args: SelectSubset<T, UsageAlertCreateArgs<ExtArgs>>
    ): Prisma__UsageAlertClient<$Result.GetResult<Prisma.$UsageAlertPayload<ExtArgs>, T, 'create'>, never, ExtArgs>

    /**
     * Create many UsageAlerts.
     * @param {UsageAlertCreateManyArgs} args - Arguments to create many UsageAlerts.
     * @example
     * // Create many UsageAlerts
     * const usageAlert = await prisma.usageAlert.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
    **/
    createMany<T extends UsageAlertCreateManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UsageAlertCreateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many UsageAlerts and returns the data saved in the database.
     * @param {UsageAlertCreateManyAndReturnArgs} args - Arguments to create many UsageAlerts.
     * @example
     * // Create many UsageAlerts
     * const usageAlert = await prisma.usageAlert.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many UsageAlerts and only return the `id`
     * const usageAlertWithIdOnly = await prisma.usageAlert.createManyAndReturn({ 
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
    **/
    createManyAndReturn<T extends UsageAlertCreateManyAndReturnArgs<ExtArgs>>(
      args?: SelectSubset<T, UsageAlertCreateManyAndReturnArgs<ExtArgs>>
    ): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UsageAlertPayload<ExtArgs>, T, 'createManyAndReturn'>>

    /**
     * Delete a UsageAlert.
     * @param {UsageAlertDeleteArgs} args - Arguments to delete one UsageAlert.
     * @example
     * // Delete one UsageAlert
     * const UsageAlert = await prisma.usageAlert.delete({
     *   where: {
     *     // ... filter to delete one UsageAlert
     *   }
     * })
     * 
    **/
    delete<T extends UsageAlertDeleteArgs<ExtArgs>>(
      args: SelectSubset<T, UsageAlertDeleteArgs<ExtArgs>>
    ): Prisma__UsageAlertClient<$Result.GetResult<Prisma.$UsageAlertPayload<ExtArgs>, T, 'delete'>, never, ExtArgs>

    /**
     * Update one UsageAlert.
     * @param {UsageAlertUpdateArgs} args - Arguments to update one UsageAlert.
     * @example
     * // Update one UsageAlert
     * const usageAlert = await prisma.usageAlert.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    update<T extends UsageAlertUpdateArgs<ExtArgs>>(
      args: SelectSubset<T, UsageAlertUpdateArgs<ExtArgs>>
    ): Prisma__UsageAlertClient<$Result.GetResult<Prisma.$UsageAlertPayload<ExtArgs>, T, 'update'>, never, ExtArgs>

    /**
     * Delete zero or more UsageAlerts.
     * @param {UsageAlertDeleteManyArgs} args - Arguments to filter UsageAlerts to delete.
     * @example
     * // Delete a few UsageAlerts
     * const { count } = await prisma.usageAlert.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
    **/
    deleteMany<T extends UsageAlertDeleteManyArgs<ExtArgs>>(
      args?: SelectSubset<T, UsageAlertDeleteManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UsageAlerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageAlertUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UsageAlerts
     * const usageAlert = await prisma.usageAlert.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
    **/
    updateMany<T extends UsageAlertUpdateManyArgs<ExtArgs>>(
      args: SelectSubset<T, UsageAlertUpdateManyArgs<ExtArgs>>
    ): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UsageAlert.
     * @param {UsageAlertUpsertArgs} args - Arguments to update or create a UsageAlert.
     * @example
     * // Update or create a UsageAlert
     * const usageAlert = await prisma.usageAlert.upsert({
     *   create: {
     *     // ... data to create a UsageAlert
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UsageAlert we want to update
     *   }
     * })
    **/
    upsert<T extends UsageAlertUpsertArgs<ExtArgs>>(
      args: SelectSubset<T, UsageAlertUpsertArgs<ExtArgs>>
    ): Prisma__UsageAlertClient<$Result.GetResult<Prisma.$UsageAlertPayload<ExtArgs>, T, 'upsert'>, never, ExtArgs>

    /**
     * Count the number of UsageAlerts.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageAlertCountArgs} args - Arguments to filter UsageAlerts to count.
     * @example
     * // Count the number of UsageAlerts
     * const count = await prisma.usageAlert.count({
     *   where: {
     *     // ... the filter for the UsageAlerts we want to count
     *   }
     * })
    **/
    count<T extends UsageAlertCountArgs>(
      args?: Subset<T, UsageAlertCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UsageAlertCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UsageAlert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageAlertAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UsageAlertAggregateArgs>(args: Subset<T, UsageAlertAggregateArgs>): Prisma.PrismaPromise<GetUsageAlertAggregateType<T>>

    /**
     * Group by UsageAlert.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UsageAlertGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UsageAlertGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UsageAlertGroupByArgs['orderBy'] }
        : { orderBy?: UsageAlertGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UsageAlertGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUsageAlertGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UsageAlert model
   */
  readonly fields: UsageAlertFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UsageAlert.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UsageAlertClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: 'PrismaPromise';

    tenant<T extends TenantDefaultArgs<ExtArgs> = {}>(args?: Subset<T, TenantDefaultArgs<ExtArgs>>): Prisma__TenantClient<$Result.GetResult<Prisma.$TenantPayload<ExtArgs>, T, 'findUniqueOrThrow'> | Null, Null, ExtArgs>;

    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>;
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>;
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>;
  }



  /**
   * Fields of the UsageAlert model
   */ 
  interface UsageAlertFieldRefs {
    readonly id: FieldRef<"UsageAlert", 'String'>
    readonly tenantId: FieldRef<"UsageAlert", 'String'>
    readonly resource: FieldRef<"UsageAlert", 'String'>
    readonly level: FieldRef<"UsageAlert", 'String'>
    readonly percentage: FieldRef<"UsageAlert", 'Int'>
    readonly current: FieldRef<"UsageAlert", 'Float'>
    readonly limit: FieldRef<"UsageAlert", 'Float'>
    readonly message: FieldRef<"UsageAlert", 'String'>
    readonly isRead: FieldRef<"UsageAlert", 'Boolean'>
    readonly isSent: FieldRef<"UsageAlert", 'Boolean'>
    readonly sentAt: FieldRef<"UsageAlert", 'DateTime'>
    readonly createdAt: FieldRef<"UsageAlert", 'DateTime'>
    readonly resolvedAt: FieldRef<"UsageAlert", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UsageAlert findUnique
   */
  export type UsageAlertFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageAlert
     */
    select?: UsageAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageAlertInclude<ExtArgs> | null
    /**
     * Filter, which UsageAlert to fetch.
     */
    where: UsageAlertWhereUniqueInput
  }

  /**
   * UsageAlert findUniqueOrThrow
   */
  export type UsageAlertFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageAlert
     */
    select?: UsageAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageAlertInclude<ExtArgs> | null
    /**
     * Filter, which UsageAlert to fetch.
     */
    where: UsageAlertWhereUniqueInput
  }

  /**
   * UsageAlert findFirst
   */
  export type UsageAlertFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageAlert
     */
    select?: UsageAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageAlertInclude<ExtArgs> | null
    /**
     * Filter, which UsageAlert to fetch.
     */
    where?: UsageAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageAlerts to fetch.
     */
    orderBy?: UsageAlertOrderByWithRelationInput | UsageAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsageAlerts.
     */
    cursor?: UsageAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsageAlerts.
     */
    distinct?: UsageAlertScalarFieldEnum | UsageAlertScalarFieldEnum[]
  }

  /**
   * UsageAlert findFirstOrThrow
   */
  export type UsageAlertFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageAlert
     */
    select?: UsageAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageAlertInclude<ExtArgs> | null
    /**
     * Filter, which UsageAlert to fetch.
     */
    where?: UsageAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageAlerts to fetch.
     */
    orderBy?: UsageAlertOrderByWithRelationInput | UsageAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UsageAlerts.
     */
    cursor?: UsageAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageAlerts.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UsageAlerts.
     */
    distinct?: UsageAlertScalarFieldEnum | UsageAlertScalarFieldEnum[]
  }

  /**
   * UsageAlert findMany
   */
  export type UsageAlertFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageAlert
     */
    select?: UsageAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageAlertInclude<ExtArgs> | null
    /**
     * Filter, which UsageAlerts to fetch.
     */
    where?: UsageAlertWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UsageAlerts to fetch.
     */
    orderBy?: UsageAlertOrderByWithRelationInput | UsageAlertOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UsageAlerts.
     */
    cursor?: UsageAlertWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UsageAlerts from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UsageAlerts.
     */
    skip?: number
    distinct?: UsageAlertScalarFieldEnum | UsageAlertScalarFieldEnum[]
  }

  /**
   * UsageAlert create
   */
  export type UsageAlertCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageAlert
     */
    select?: UsageAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageAlertInclude<ExtArgs> | null
    /**
     * The data needed to create a UsageAlert.
     */
    data: XOR<UsageAlertCreateInput, UsageAlertUncheckedCreateInput>
  }

  /**
   * UsageAlert createMany
   */
  export type UsageAlertCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UsageAlerts.
     */
    data: UsageAlertCreateManyInput | UsageAlertCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * UsageAlert createManyAndReturn
   */
  export type UsageAlertCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageAlert
     */
    select?: UsageAlertSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * The data used to create many UsageAlerts.
     */
    data: UsageAlertCreateManyInput | UsageAlertCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageAlertIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * UsageAlert update
   */
  export type UsageAlertUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageAlert
     */
    select?: UsageAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageAlertInclude<ExtArgs> | null
    /**
     * The data needed to update a UsageAlert.
     */
    data: XOR<UsageAlertUpdateInput, UsageAlertUncheckedUpdateInput>
    /**
     * Choose, which UsageAlert to update.
     */
    where: UsageAlertWhereUniqueInput
  }

  /**
   * UsageAlert updateMany
   */
  export type UsageAlertUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UsageAlerts.
     */
    data: XOR<UsageAlertUpdateManyMutationInput, UsageAlertUncheckedUpdateManyInput>
    /**
     * Filter which UsageAlerts to update
     */
    where?: UsageAlertWhereInput
  }

  /**
   * UsageAlert upsert
   */
  export type UsageAlertUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageAlert
     */
    select?: UsageAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageAlertInclude<ExtArgs> | null
    /**
     * The filter to search for the UsageAlert to update in case it exists.
     */
    where: UsageAlertWhereUniqueInput
    /**
     * In case the UsageAlert found by the `where` argument doesn't exist, create a new UsageAlert with this data.
     */
    create: XOR<UsageAlertCreateInput, UsageAlertUncheckedCreateInput>
    /**
     * In case the UsageAlert was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UsageAlertUpdateInput, UsageAlertUncheckedUpdateInput>
  }

  /**
   * UsageAlert delete
   */
  export type UsageAlertDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageAlert
     */
    select?: UsageAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageAlertInclude<ExtArgs> | null
    /**
     * Filter which UsageAlert to delete.
     */
    where: UsageAlertWhereUniqueInput
  }

  /**
   * UsageAlert deleteMany
   */
  export type UsageAlertDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UsageAlerts to delete
     */
    where?: UsageAlertWhereInput
  }

  /**
   * UsageAlert without action
   */
  export type UsageAlertDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UsageAlert
     */
    select?: UsageAlertSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UsageAlertInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const TenantScalarFieldEnum: {
    id: 'id',
    slug: 'slug',
    businessName: 'businessName',
    contactName: 'contactName',
    contactEmail: 'contactEmail',
    contactPhone: 'contactPhone',
    databaseUrl: 'databaseUrl',
    databaseHost: 'databaseHost',
    databaseName: 'databaseName',
    subscriptionTier: 'subscriptionTier',
    subscriptionStatus: 'subscriptionStatus',
    trialEndsAt: 'trialEndsAt',
    billingCycleStart: 'billingCycleStart',
    billingCycleEnd: 'billingCycleEnd',
    monthlyFee: 'monthlyFee',
    lastPaymentDate: 'lastPaymentDate',
    lastPaymentAmount: 'lastPaymentAmount',
    nextPaymentDue: 'nextPaymentDue',
    paymentNotes: 'paymentNotes',
    customStorageLimitMB: 'customStorageLimitMB',
    customBandwidthLimitGB: 'customBandwidthLimitGB',
    customOrdersLimit: 'customOrdersLimit',
    customStaffLimit: 'customStaffLimit',
    hasPrioritySupport: 'hasPrioritySupport',
    currentStorageUsageMB: 'currentStorageUsageMB',
    currentBandwidthGB: 'currentBandwidthGB',
    currentMonthOrders: 'currentMonthOrders',
    currentStaffCount: 'currentStaffCount',
    lastBillingCalculation: 'lastBillingCalculation',
    lastMonthOverageCharges: 'lastMonthOverageCharges',
    lastMonthTotalBill: 'lastMonthTotalBill',
    status: 'status',
    isActive: 'isActive',
    maxLocations: 'maxLocations',
    maxUsers: 'maxUsers',
    maxDbSizeMB: 'maxDbSizeMB',
    maxApiRequests: 'maxApiRequests',
    maxStorageMB: 'maxStorageMB',
    currentDbSizeMB: 'currentDbSizeMB',
    currentStorageMB: 'currentStorageMB',
    dbLimitExceeded: 'dbLimitExceeded',
    apiLimitExceeded: 'apiLimitExceeded',
    limitExceededAt: 'limitExceededAt',
    features: 'features',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    activatedAt: 'activatedAt',
    suspendedAt: 'suspendedAt'
  };

  export type TenantScalarFieldEnum = (typeof TenantScalarFieldEnum)[keyof typeof TenantScalarFieldEnum]


  export const PaymentRecordScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    amount: 'amount',
    paymentDate: 'paymentDate',
    paymentMethod: 'paymentMethod',
    referenceNumber: 'referenceNumber',
    billingPeriodStart: 'billingPeriodStart',
    billingPeriodEnd: 'billingPeriodEnd',
    notes: 'notes',
    receivedBy: 'receivedBy',
    createdAt: 'createdAt'
  };

  export type PaymentRecordScalarFieldEnum = (typeof PaymentRecordScalarFieldEnum)[keyof typeof PaymentRecordScalarFieldEnum]


  export const SuperAdminScalarFieldEnum: {
    id: 'id',
    name: 'name',
    email: 'email',
    password: 'password',
    role: 'role',
    isActive: 'isActive',
    failedLoginAttempts: 'failedLoginAttempts',
    lockedUntil: 'lockedUntil',
    lastFailedLogin: 'lastFailedLogin',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    lastLoginAt: 'lastLoginAt'
  };

  export type SuperAdminScalarFieldEnum = (typeof SuperAdminScalarFieldEnum)[keyof typeof SuperAdminScalarFieldEnum]


  export const TenantActivityLogScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    action: 'action',
    performedBy: 'performedBy',
    details: 'details',
    ipAddress: 'ipAddress',
    createdAt: 'createdAt'
  };

  export type TenantActivityLogScalarFieldEnum = (typeof TenantActivityLogScalarFieldEnum)[keyof typeof TenantActivityLogScalarFieldEnum]


  export const TenantMetricsScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    date: 'date',
    totalRevenue: 'totalRevenue',
    totalOrders: 'totalOrders',
    activeUsers: 'activeUsers',
    activeLocations: 'activeLocations',
    createdAt: 'createdAt'
  };

  export type TenantMetricsScalarFieldEnum = (typeof TenantMetricsScalarFieldEnum)[keyof typeof TenantMetricsScalarFieldEnum]


  export const TenantUsageScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    date: 'date',
    dbSizeMB: 'dbSizeMB',
    dbSizeBytes: 'dbSizeBytes',
    apiRequests: 'apiRequests',
    apiRequestsByEndpoint: 'apiRequestsByEndpoint',
    storageSizeMB: 'storageSizeMB',
    dbOverage: 'dbOverage',
    apiOverage: 'apiOverage',
    overageAmount: 'overageAmount',
    recordedAt: 'recordedAt',
    createdAt: 'createdAt'
  };

  export type TenantUsageScalarFieldEnum = (typeof TenantUsageScalarFieldEnum)[keyof typeof TenantUsageScalarFieldEnum]


  export const UsageAlertScalarFieldEnum: {
    id: 'id',
    tenantId: 'tenantId',
    resource: 'resource',
    level: 'level',
    percentage: 'percentage',
    current: 'current',
    limit: 'limit',
    message: 'message',
    isRead: 'isRead',
    isSent: 'isSent',
    sentAt: 'sentAt',
    createdAt: 'createdAt',
    resolvedAt: 'resolvedAt'
  };

  export type UsageAlertScalarFieldEnum = (typeof UsageAlertScalarFieldEnum)[keyof typeof UsageAlertScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const NullableJsonNullValueInput: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull
  };

  export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'SubscriptionTier'
   */
  export type EnumSubscriptionTierFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionTier'>
    


  /**
   * Reference to a field of type 'SubscriptionTier[]'
   */
  export type ListEnumSubscriptionTierFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionTier[]'>
    


  /**
   * Reference to a field of type 'SubscriptionStatus'
   */
  export type EnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus'>
    


  /**
   * Reference to a field of type 'SubscriptionStatus[]'
   */
  export type ListEnumSubscriptionStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SubscriptionStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'TenantStatus'
   */
  export type EnumTenantStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TenantStatus'>
    


  /**
   * Reference to a field of type 'TenantStatus[]'
   */
  export type ListEnumTenantStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'TenantStatus[]'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'SuperAdminRole'
   */
  export type EnumSuperAdminRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SuperAdminRole'>
    


  /**
   * Reference to a field of type 'SuperAdminRole[]'
   */
  export type ListEnumSuperAdminRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'SuperAdminRole[]'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'BigInt[]'
   */
  export type ListBigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt[]'>
    
  /**
   * Deep Input Types
   */


  export type TenantWhereInput = {
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    id?: StringFilter<"Tenant"> | string
    slug?: StringFilter<"Tenant"> | string
    businessName?: StringFilter<"Tenant"> | string
    contactName?: StringFilter<"Tenant"> | string
    contactEmail?: StringFilter<"Tenant"> | string
    contactPhone?: StringNullableFilter<"Tenant"> | string | null
    databaseUrl?: StringFilter<"Tenant"> | string
    databaseHost?: StringFilter<"Tenant"> | string
    databaseName?: StringFilter<"Tenant"> | string
    subscriptionTier?: EnumSubscriptionTierFilter<"Tenant"> | $Enums.SubscriptionTier
    subscriptionStatus?: EnumSubscriptionStatusFilter<"Tenant"> | $Enums.SubscriptionStatus
    trialEndsAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    billingCycleStart?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    billingCycleEnd?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    monthlyFee?: FloatFilter<"Tenant"> | number
    lastPaymentDate?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    lastPaymentAmount?: FloatNullableFilter<"Tenant"> | number | null
    nextPaymentDue?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    paymentNotes?: StringNullableFilter<"Tenant"> | string | null
    customStorageLimitMB?: IntNullableFilter<"Tenant"> | number | null
    customBandwidthLimitGB?: IntNullableFilter<"Tenant"> | number | null
    customOrdersLimit?: IntNullableFilter<"Tenant"> | number | null
    customStaffLimit?: IntNullableFilter<"Tenant"> | number | null
    hasPrioritySupport?: BoolFilter<"Tenant"> | boolean
    currentStorageUsageMB?: FloatFilter<"Tenant"> | number
    currentBandwidthGB?: FloatFilter<"Tenant"> | number
    currentMonthOrders?: IntFilter<"Tenant"> | number
    currentStaffCount?: IntFilter<"Tenant"> | number
    lastBillingCalculation?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    lastMonthOverageCharges?: FloatFilter<"Tenant"> | number
    lastMonthTotalBill?: FloatFilter<"Tenant"> | number
    status?: EnumTenantStatusFilter<"Tenant"> | $Enums.TenantStatus
    isActive?: BoolFilter<"Tenant"> | boolean
    maxLocations?: IntFilter<"Tenant"> | number
    maxUsers?: IntFilter<"Tenant"> | number
    maxDbSizeMB?: IntFilter<"Tenant"> | number
    maxApiRequests?: IntFilter<"Tenant"> | number
    maxStorageMB?: IntFilter<"Tenant"> | number
    currentDbSizeMB?: FloatFilter<"Tenant"> | number
    currentStorageMB?: FloatFilter<"Tenant"> | number
    dbLimitExceeded?: BoolFilter<"Tenant"> | boolean
    apiLimitExceeded?: BoolFilter<"Tenant"> | boolean
    limitExceededAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    features?: JsonNullableFilter<"Tenant">
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    activatedAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    suspendedAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    paymentRecords?: PaymentRecordListRelationFilter
    activityLogs?: TenantActivityLogListRelationFilter
    metrics?: TenantMetricsListRelationFilter
    usageHistory?: TenantUsageListRelationFilter
    usageAlerts?: UsageAlertListRelationFilter
  }

  export type TenantOrderByWithRelationInput = {
    id?: SortOrder
    slug?: SortOrder
    businessName?: SortOrder
    contactName?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrderInput | SortOrder
    databaseUrl?: SortOrder
    databaseHost?: SortOrder
    databaseName?: SortOrder
    subscriptionTier?: SortOrder
    subscriptionStatus?: SortOrder
    trialEndsAt?: SortOrderInput | SortOrder
    billingCycleStart?: SortOrderInput | SortOrder
    billingCycleEnd?: SortOrderInput | SortOrder
    monthlyFee?: SortOrder
    lastPaymentDate?: SortOrderInput | SortOrder
    lastPaymentAmount?: SortOrderInput | SortOrder
    nextPaymentDue?: SortOrderInput | SortOrder
    paymentNotes?: SortOrderInput | SortOrder
    customStorageLimitMB?: SortOrderInput | SortOrder
    customBandwidthLimitGB?: SortOrderInput | SortOrder
    customOrdersLimit?: SortOrderInput | SortOrder
    customStaffLimit?: SortOrderInput | SortOrder
    hasPrioritySupport?: SortOrder
    currentStorageUsageMB?: SortOrder
    currentBandwidthGB?: SortOrder
    currentMonthOrders?: SortOrder
    currentStaffCount?: SortOrder
    lastBillingCalculation?: SortOrderInput | SortOrder
    lastMonthOverageCharges?: SortOrder
    lastMonthTotalBill?: SortOrder
    status?: SortOrder
    isActive?: SortOrder
    maxLocations?: SortOrder
    maxUsers?: SortOrder
    maxDbSizeMB?: SortOrder
    maxApiRequests?: SortOrder
    maxStorageMB?: SortOrder
    currentDbSizeMB?: SortOrder
    currentStorageMB?: SortOrder
    dbLimitExceeded?: SortOrder
    apiLimitExceeded?: SortOrder
    limitExceededAt?: SortOrderInput | SortOrder
    features?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    activatedAt?: SortOrderInput | SortOrder
    suspendedAt?: SortOrderInput | SortOrder
    paymentRecords?: PaymentRecordOrderByRelationAggregateInput
    activityLogs?: TenantActivityLogOrderByRelationAggregateInput
    metrics?: TenantMetricsOrderByRelationAggregateInput
    usageHistory?: TenantUsageOrderByRelationAggregateInput
    usageAlerts?: UsageAlertOrderByRelationAggregateInput
  }

  export type TenantWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    contactEmail?: string
    AND?: TenantWhereInput | TenantWhereInput[]
    OR?: TenantWhereInput[]
    NOT?: TenantWhereInput | TenantWhereInput[]
    businessName?: StringFilter<"Tenant"> | string
    contactName?: StringFilter<"Tenant"> | string
    contactPhone?: StringNullableFilter<"Tenant"> | string | null
    databaseUrl?: StringFilter<"Tenant"> | string
    databaseHost?: StringFilter<"Tenant"> | string
    databaseName?: StringFilter<"Tenant"> | string
    subscriptionTier?: EnumSubscriptionTierFilter<"Tenant"> | $Enums.SubscriptionTier
    subscriptionStatus?: EnumSubscriptionStatusFilter<"Tenant"> | $Enums.SubscriptionStatus
    trialEndsAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    billingCycleStart?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    billingCycleEnd?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    monthlyFee?: FloatFilter<"Tenant"> | number
    lastPaymentDate?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    lastPaymentAmount?: FloatNullableFilter<"Tenant"> | number | null
    nextPaymentDue?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    paymentNotes?: StringNullableFilter<"Tenant"> | string | null
    customStorageLimitMB?: IntNullableFilter<"Tenant"> | number | null
    customBandwidthLimitGB?: IntNullableFilter<"Tenant"> | number | null
    customOrdersLimit?: IntNullableFilter<"Tenant"> | number | null
    customStaffLimit?: IntNullableFilter<"Tenant"> | number | null
    hasPrioritySupport?: BoolFilter<"Tenant"> | boolean
    currentStorageUsageMB?: FloatFilter<"Tenant"> | number
    currentBandwidthGB?: FloatFilter<"Tenant"> | number
    currentMonthOrders?: IntFilter<"Tenant"> | number
    currentStaffCount?: IntFilter<"Tenant"> | number
    lastBillingCalculation?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    lastMonthOverageCharges?: FloatFilter<"Tenant"> | number
    lastMonthTotalBill?: FloatFilter<"Tenant"> | number
    status?: EnumTenantStatusFilter<"Tenant"> | $Enums.TenantStatus
    isActive?: BoolFilter<"Tenant"> | boolean
    maxLocations?: IntFilter<"Tenant"> | number
    maxUsers?: IntFilter<"Tenant"> | number
    maxDbSizeMB?: IntFilter<"Tenant"> | number
    maxApiRequests?: IntFilter<"Tenant"> | number
    maxStorageMB?: IntFilter<"Tenant"> | number
    currentDbSizeMB?: FloatFilter<"Tenant"> | number
    currentStorageMB?: FloatFilter<"Tenant"> | number
    dbLimitExceeded?: BoolFilter<"Tenant"> | boolean
    apiLimitExceeded?: BoolFilter<"Tenant"> | boolean
    limitExceededAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    features?: JsonNullableFilter<"Tenant">
    createdAt?: DateTimeFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeFilter<"Tenant"> | Date | string
    activatedAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    suspendedAt?: DateTimeNullableFilter<"Tenant"> | Date | string | null
    paymentRecords?: PaymentRecordListRelationFilter
    activityLogs?: TenantActivityLogListRelationFilter
    metrics?: TenantMetricsListRelationFilter
    usageHistory?: TenantUsageListRelationFilter
    usageAlerts?: UsageAlertListRelationFilter
  }, "id" | "slug" | "contactEmail">

  export type TenantOrderByWithAggregationInput = {
    id?: SortOrder
    slug?: SortOrder
    businessName?: SortOrder
    contactName?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrderInput | SortOrder
    databaseUrl?: SortOrder
    databaseHost?: SortOrder
    databaseName?: SortOrder
    subscriptionTier?: SortOrder
    subscriptionStatus?: SortOrder
    trialEndsAt?: SortOrderInput | SortOrder
    billingCycleStart?: SortOrderInput | SortOrder
    billingCycleEnd?: SortOrderInput | SortOrder
    monthlyFee?: SortOrder
    lastPaymentDate?: SortOrderInput | SortOrder
    lastPaymentAmount?: SortOrderInput | SortOrder
    nextPaymentDue?: SortOrderInput | SortOrder
    paymentNotes?: SortOrderInput | SortOrder
    customStorageLimitMB?: SortOrderInput | SortOrder
    customBandwidthLimitGB?: SortOrderInput | SortOrder
    customOrdersLimit?: SortOrderInput | SortOrder
    customStaffLimit?: SortOrderInput | SortOrder
    hasPrioritySupport?: SortOrder
    currentStorageUsageMB?: SortOrder
    currentBandwidthGB?: SortOrder
    currentMonthOrders?: SortOrder
    currentStaffCount?: SortOrder
    lastBillingCalculation?: SortOrderInput | SortOrder
    lastMonthOverageCharges?: SortOrder
    lastMonthTotalBill?: SortOrder
    status?: SortOrder
    isActive?: SortOrder
    maxLocations?: SortOrder
    maxUsers?: SortOrder
    maxDbSizeMB?: SortOrder
    maxApiRequests?: SortOrder
    maxStorageMB?: SortOrder
    currentDbSizeMB?: SortOrder
    currentStorageMB?: SortOrder
    dbLimitExceeded?: SortOrder
    apiLimitExceeded?: SortOrder
    limitExceededAt?: SortOrderInput | SortOrder
    features?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    activatedAt?: SortOrderInput | SortOrder
    suspendedAt?: SortOrderInput | SortOrder
    _count?: TenantCountOrderByAggregateInput
    _avg?: TenantAvgOrderByAggregateInput
    _max?: TenantMaxOrderByAggregateInput
    _min?: TenantMinOrderByAggregateInput
    _sum?: TenantSumOrderByAggregateInput
  }

  export type TenantScalarWhereWithAggregatesInput = {
    AND?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    OR?: TenantScalarWhereWithAggregatesInput[]
    NOT?: TenantScalarWhereWithAggregatesInput | TenantScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Tenant"> | string
    slug?: StringWithAggregatesFilter<"Tenant"> | string
    businessName?: StringWithAggregatesFilter<"Tenant"> | string
    contactName?: StringWithAggregatesFilter<"Tenant"> | string
    contactEmail?: StringWithAggregatesFilter<"Tenant"> | string
    contactPhone?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    databaseUrl?: StringWithAggregatesFilter<"Tenant"> | string
    databaseHost?: StringWithAggregatesFilter<"Tenant"> | string
    databaseName?: StringWithAggregatesFilter<"Tenant"> | string
    subscriptionTier?: EnumSubscriptionTierWithAggregatesFilter<"Tenant"> | $Enums.SubscriptionTier
    subscriptionStatus?: EnumSubscriptionStatusWithAggregatesFilter<"Tenant"> | $Enums.SubscriptionStatus
    trialEndsAt?: DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null
    billingCycleStart?: DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null
    billingCycleEnd?: DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null
    monthlyFee?: FloatWithAggregatesFilter<"Tenant"> | number
    lastPaymentDate?: DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null
    lastPaymentAmount?: FloatNullableWithAggregatesFilter<"Tenant"> | number | null
    nextPaymentDue?: DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null
    paymentNotes?: StringNullableWithAggregatesFilter<"Tenant"> | string | null
    customStorageLimitMB?: IntNullableWithAggregatesFilter<"Tenant"> | number | null
    customBandwidthLimitGB?: IntNullableWithAggregatesFilter<"Tenant"> | number | null
    customOrdersLimit?: IntNullableWithAggregatesFilter<"Tenant"> | number | null
    customStaffLimit?: IntNullableWithAggregatesFilter<"Tenant"> | number | null
    hasPrioritySupport?: BoolWithAggregatesFilter<"Tenant"> | boolean
    currentStorageUsageMB?: FloatWithAggregatesFilter<"Tenant"> | number
    currentBandwidthGB?: FloatWithAggregatesFilter<"Tenant"> | number
    currentMonthOrders?: IntWithAggregatesFilter<"Tenant"> | number
    currentStaffCount?: IntWithAggregatesFilter<"Tenant"> | number
    lastBillingCalculation?: DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null
    lastMonthOverageCharges?: FloatWithAggregatesFilter<"Tenant"> | number
    lastMonthTotalBill?: FloatWithAggregatesFilter<"Tenant"> | number
    status?: EnumTenantStatusWithAggregatesFilter<"Tenant"> | $Enums.TenantStatus
    isActive?: BoolWithAggregatesFilter<"Tenant"> | boolean
    maxLocations?: IntWithAggregatesFilter<"Tenant"> | number
    maxUsers?: IntWithAggregatesFilter<"Tenant"> | number
    maxDbSizeMB?: IntWithAggregatesFilter<"Tenant"> | number
    maxApiRequests?: IntWithAggregatesFilter<"Tenant"> | number
    maxStorageMB?: IntWithAggregatesFilter<"Tenant"> | number
    currentDbSizeMB?: FloatWithAggregatesFilter<"Tenant"> | number
    currentStorageMB?: FloatWithAggregatesFilter<"Tenant"> | number
    dbLimitExceeded?: BoolWithAggregatesFilter<"Tenant"> | boolean
    apiLimitExceeded?: BoolWithAggregatesFilter<"Tenant"> | boolean
    limitExceededAt?: DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null
    features?: JsonNullableWithAggregatesFilter<"Tenant">
    createdAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Tenant"> | Date | string
    activatedAt?: DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null
    suspendedAt?: DateTimeNullableWithAggregatesFilter<"Tenant"> | Date | string | null
  }

  export type PaymentRecordWhereInput = {
    AND?: PaymentRecordWhereInput | PaymentRecordWhereInput[]
    OR?: PaymentRecordWhereInput[]
    NOT?: PaymentRecordWhereInput | PaymentRecordWhereInput[]
    id?: StringFilter<"PaymentRecord"> | string
    tenantId?: StringFilter<"PaymentRecord"> | string
    amount?: FloatFilter<"PaymentRecord"> | number
    paymentDate?: DateTimeFilter<"PaymentRecord"> | Date | string
    paymentMethod?: StringFilter<"PaymentRecord"> | string
    referenceNumber?: StringNullableFilter<"PaymentRecord"> | string | null
    billingPeriodStart?: DateTimeFilter<"PaymentRecord"> | Date | string
    billingPeriodEnd?: DateTimeFilter<"PaymentRecord"> | Date | string
    notes?: StringNullableFilter<"PaymentRecord"> | string | null
    receivedBy?: StringFilter<"PaymentRecord"> | string
    createdAt?: DateTimeFilter<"PaymentRecord"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }

  export type PaymentRecordOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    paymentDate?: SortOrder
    paymentMethod?: SortOrder
    referenceNumber?: SortOrderInput | SortOrder
    billingPeriodStart?: SortOrder
    billingPeriodEnd?: SortOrder
    notes?: SortOrderInput | SortOrder
    receivedBy?: SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type PaymentRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PaymentRecordWhereInput | PaymentRecordWhereInput[]
    OR?: PaymentRecordWhereInput[]
    NOT?: PaymentRecordWhereInput | PaymentRecordWhereInput[]
    tenantId?: StringFilter<"PaymentRecord"> | string
    amount?: FloatFilter<"PaymentRecord"> | number
    paymentDate?: DateTimeFilter<"PaymentRecord"> | Date | string
    paymentMethod?: StringFilter<"PaymentRecord"> | string
    referenceNumber?: StringNullableFilter<"PaymentRecord"> | string | null
    billingPeriodStart?: DateTimeFilter<"PaymentRecord"> | Date | string
    billingPeriodEnd?: DateTimeFilter<"PaymentRecord"> | Date | string
    notes?: StringNullableFilter<"PaymentRecord"> | string | null
    receivedBy?: StringFilter<"PaymentRecord"> | string
    createdAt?: DateTimeFilter<"PaymentRecord"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }, "id">

  export type PaymentRecordOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    paymentDate?: SortOrder
    paymentMethod?: SortOrder
    referenceNumber?: SortOrderInput | SortOrder
    billingPeriodStart?: SortOrder
    billingPeriodEnd?: SortOrder
    notes?: SortOrderInput | SortOrder
    receivedBy?: SortOrder
    createdAt?: SortOrder
    _count?: PaymentRecordCountOrderByAggregateInput
    _avg?: PaymentRecordAvgOrderByAggregateInput
    _max?: PaymentRecordMaxOrderByAggregateInput
    _min?: PaymentRecordMinOrderByAggregateInput
    _sum?: PaymentRecordSumOrderByAggregateInput
  }

  export type PaymentRecordScalarWhereWithAggregatesInput = {
    AND?: PaymentRecordScalarWhereWithAggregatesInput | PaymentRecordScalarWhereWithAggregatesInput[]
    OR?: PaymentRecordScalarWhereWithAggregatesInput[]
    NOT?: PaymentRecordScalarWhereWithAggregatesInput | PaymentRecordScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PaymentRecord"> | string
    tenantId?: StringWithAggregatesFilter<"PaymentRecord"> | string
    amount?: FloatWithAggregatesFilter<"PaymentRecord"> | number
    paymentDate?: DateTimeWithAggregatesFilter<"PaymentRecord"> | Date | string
    paymentMethod?: StringWithAggregatesFilter<"PaymentRecord"> | string
    referenceNumber?: StringNullableWithAggregatesFilter<"PaymentRecord"> | string | null
    billingPeriodStart?: DateTimeWithAggregatesFilter<"PaymentRecord"> | Date | string
    billingPeriodEnd?: DateTimeWithAggregatesFilter<"PaymentRecord"> | Date | string
    notes?: StringNullableWithAggregatesFilter<"PaymentRecord"> | string | null
    receivedBy?: StringWithAggregatesFilter<"PaymentRecord"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PaymentRecord"> | Date | string
  }

  export type SuperAdminWhereInput = {
    AND?: SuperAdminWhereInput | SuperAdminWhereInput[]
    OR?: SuperAdminWhereInput[]
    NOT?: SuperAdminWhereInput | SuperAdminWhereInput[]
    id?: StringFilter<"SuperAdmin"> | string
    name?: StringFilter<"SuperAdmin"> | string
    email?: StringFilter<"SuperAdmin"> | string
    password?: StringFilter<"SuperAdmin"> | string
    role?: EnumSuperAdminRoleFilter<"SuperAdmin"> | $Enums.SuperAdminRole
    isActive?: BoolFilter<"SuperAdmin"> | boolean
    failedLoginAttempts?: IntFilter<"SuperAdmin"> | number
    lockedUntil?: DateTimeNullableFilter<"SuperAdmin"> | Date | string | null
    lastFailedLogin?: DateTimeNullableFilter<"SuperAdmin"> | Date | string | null
    createdAt?: DateTimeFilter<"SuperAdmin"> | Date | string
    updatedAt?: DateTimeFilter<"SuperAdmin"> | Date | string
    lastLoginAt?: DateTimeNullableFilter<"SuperAdmin"> | Date | string | null
    activityLogs?: TenantActivityLogListRelationFilter
  }

  export type SuperAdminOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrderInput | SortOrder
    lastFailedLogin?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    activityLogs?: TenantActivityLogOrderByRelationAggregateInput
  }

  export type SuperAdminWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: SuperAdminWhereInput | SuperAdminWhereInput[]
    OR?: SuperAdminWhereInput[]
    NOT?: SuperAdminWhereInput | SuperAdminWhereInput[]
    name?: StringFilter<"SuperAdmin"> | string
    password?: StringFilter<"SuperAdmin"> | string
    role?: EnumSuperAdminRoleFilter<"SuperAdmin"> | $Enums.SuperAdminRole
    isActive?: BoolFilter<"SuperAdmin"> | boolean
    failedLoginAttempts?: IntFilter<"SuperAdmin"> | number
    lockedUntil?: DateTimeNullableFilter<"SuperAdmin"> | Date | string | null
    lastFailedLogin?: DateTimeNullableFilter<"SuperAdmin"> | Date | string | null
    createdAt?: DateTimeFilter<"SuperAdmin"> | Date | string
    updatedAt?: DateTimeFilter<"SuperAdmin"> | Date | string
    lastLoginAt?: DateTimeNullableFilter<"SuperAdmin"> | Date | string | null
    activityLogs?: TenantActivityLogListRelationFilter
  }, "id" | "email">

  export type SuperAdminOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrderInput | SortOrder
    lastFailedLogin?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrderInput | SortOrder
    _count?: SuperAdminCountOrderByAggregateInput
    _avg?: SuperAdminAvgOrderByAggregateInput
    _max?: SuperAdminMaxOrderByAggregateInput
    _min?: SuperAdminMinOrderByAggregateInput
    _sum?: SuperAdminSumOrderByAggregateInput
  }

  export type SuperAdminScalarWhereWithAggregatesInput = {
    AND?: SuperAdminScalarWhereWithAggregatesInput | SuperAdminScalarWhereWithAggregatesInput[]
    OR?: SuperAdminScalarWhereWithAggregatesInput[]
    NOT?: SuperAdminScalarWhereWithAggregatesInput | SuperAdminScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"SuperAdmin"> | string
    name?: StringWithAggregatesFilter<"SuperAdmin"> | string
    email?: StringWithAggregatesFilter<"SuperAdmin"> | string
    password?: StringWithAggregatesFilter<"SuperAdmin"> | string
    role?: EnumSuperAdminRoleWithAggregatesFilter<"SuperAdmin"> | $Enums.SuperAdminRole
    isActive?: BoolWithAggregatesFilter<"SuperAdmin"> | boolean
    failedLoginAttempts?: IntWithAggregatesFilter<"SuperAdmin"> | number
    lockedUntil?: DateTimeNullableWithAggregatesFilter<"SuperAdmin"> | Date | string | null
    lastFailedLogin?: DateTimeNullableWithAggregatesFilter<"SuperAdmin"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SuperAdmin"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SuperAdmin"> | Date | string
    lastLoginAt?: DateTimeNullableWithAggregatesFilter<"SuperAdmin"> | Date | string | null
  }

  export type TenantActivityLogWhereInput = {
    AND?: TenantActivityLogWhereInput | TenantActivityLogWhereInput[]
    OR?: TenantActivityLogWhereInput[]
    NOT?: TenantActivityLogWhereInput | TenantActivityLogWhereInput[]
    id?: StringFilter<"TenantActivityLog"> | string
    tenantId?: StringFilter<"TenantActivityLog"> | string
    action?: StringFilter<"TenantActivityLog"> | string
    performedBy?: StringNullableFilter<"TenantActivityLog"> | string | null
    details?: JsonNullableFilter<"TenantActivityLog">
    ipAddress?: StringNullableFilter<"TenantActivityLog"> | string | null
    createdAt?: DateTimeFilter<"TenantActivityLog"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
    superAdmin?: XOR<SuperAdminNullableRelationFilter, SuperAdminWhereInput> | null
  }

  export type TenantActivityLogOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    action?: SortOrder
    performedBy?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
    superAdmin?: SuperAdminOrderByWithRelationInput
  }

  export type TenantActivityLogWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TenantActivityLogWhereInput | TenantActivityLogWhereInput[]
    OR?: TenantActivityLogWhereInput[]
    NOT?: TenantActivityLogWhereInput | TenantActivityLogWhereInput[]
    tenantId?: StringFilter<"TenantActivityLog"> | string
    action?: StringFilter<"TenantActivityLog"> | string
    performedBy?: StringNullableFilter<"TenantActivityLog"> | string | null
    details?: JsonNullableFilter<"TenantActivityLog">
    ipAddress?: StringNullableFilter<"TenantActivityLog"> | string | null
    createdAt?: DateTimeFilter<"TenantActivityLog"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
    superAdmin?: XOR<SuperAdminNullableRelationFilter, SuperAdminWhereInput> | null
  }, "id">

  export type TenantActivityLogOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    action?: SortOrder
    performedBy?: SortOrderInput | SortOrder
    details?: SortOrderInput | SortOrder
    ipAddress?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: TenantActivityLogCountOrderByAggregateInput
    _max?: TenantActivityLogMaxOrderByAggregateInput
    _min?: TenantActivityLogMinOrderByAggregateInput
  }

  export type TenantActivityLogScalarWhereWithAggregatesInput = {
    AND?: TenantActivityLogScalarWhereWithAggregatesInput | TenantActivityLogScalarWhereWithAggregatesInput[]
    OR?: TenantActivityLogScalarWhereWithAggregatesInput[]
    NOT?: TenantActivityLogScalarWhereWithAggregatesInput | TenantActivityLogScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TenantActivityLog"> | string
    tenantId?: StringWithAggregatesFilter<"TenantActivityLog"> | string
    action?: StringWithAggregatesFilter<"TenantActivityLog"> | string
    performedBy?: StringNullableWithAggregatesFilter<"TenantActivityLog"> | string | null
    details?: JsonNullableWithAggregatesFilter<"TenantActivityLog">
    ipAddress?: StringNullableWithAggregatesFilter<"TenantActivityLog"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"TenantActivityLog"> | Date | string
  }

  export type TenantMetricsWhereInput = {
    AND?: TenantMetricsWhereInput | TenantMetricsWhereInput[]
    OR?: TenantMetricsWhereInput[]
    NOT?: TenantMetricsWhereInput | TenantMetricsWhereInput[]
    id?: StringFilter<"TenantMetrics"> | string
    tenantId?: StringFilter<"TenantMetrics"> | string
    date?: DateTimeFilter<"TenantMetrics"> | Date | string
    totalRevenue?: FloatFilter<"TenantMetrics"> | number
    totalOrders?: IntFilter<"TenantMetrics"> | number
    activeUsers?: IntFilter<"TenantMetrics"> | number
    activeLocations?: IntFilter<"TenantMetrics"> | number
    createdAt?: DateTimeFilter<"TenantMetrics"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }

  export type TenantMetricsOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    date?: SortOrder
    totalRevenue?: SortOrder
    totalOrders?: SortOrder
    activeUsers?: SortOrder
    activeLocations?: SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type TenantMetricsWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_date?: TenantMetricsTenantIdDateCompoundUniqueInput
    AND?: TenantMetricsWhereInput | TenantMetricsWhereInput[]
    OR?: TenantMetricsWhereInput[]
    NOT?: TenantMetricsWhereInput | TenantMetricsWhereInput[]
    tenantId?: StringFilter<"TenantMetrics"> | string
    date?: DateTimeFilter<"TenantMetrics"> | Date | string
    totalRevenue?: FloatFilter<"TenantMetrics"> | number
    totalOrders?: IntFilter<"TenantMetrics"> | number
    activeUsers?: IntFilter<"TenantMetrics"> | number
    activeLocations?: IntFilter<"TenantMetrics"> | number
    createdAt?: DateTimeFilter<"TenantMetrics"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }, "id" | "tenantId_date">

  export type TenantMetricsOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    date?: SortOrder
    totalRevenue?: SortOrder
    totalOrders?: SortOrder
    activeUsers?: SortOrder
    activeLocations?: SortOrder
    createdAt?: SortOrder
    _count?: TenantMetricsCountOrderByAggregateInput
    _avg?: TenantMetricsAvgOrderByAggregateInput
    _max?: TenantMetricsMaxOrderByAggregateInput
    _min?: TenantMetricsMinOrderByAggregateInput
    _sum?: TenantMetricsSumOrderByAggregateInput
  }

  export type TenantMetricsScalarWhereWithAggregatesInput = {
    AND?: TenantMetricsScalarWhereWithAggregatesInput | TenantMetricsScalarWhereWithAggregatesInput[]
    OR?: TenantMetricsScalarWhereWithAggregatesInput[]
    NOT?: TenantMetricsScalarWhereWithAggregatesInput | TenantMetricsScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TenantMetrics"> | string
    tenantId?: StringWithAggregatesFilter<"TenantMetrics"> | string
    date?: DateTimeWithAggregatesFilter<"TenantMetrics"> | Date | string
    totalRevenue?: FloatWithAggregatesFilter<"TenantMetrics"> | number
    totalOrders?: IntWithAggregatesFilter<"TenantMetrics"> | number
    activeUsers?: IntWithAggregatesFilter<"TenantMetrics"> | number
    activeLocations?: IntWithAggregatesFilter<"TenantMetrics"> | number
    createdAt?: DateTimeWithAggregatesFilter<"TenantMetrics"> | Date | string
  }

  export type TenantUsageWhereInput = {
    AND?: TenantUsageWhereInput | TenantUsageWhereInput[]
    OR?: TenantUsageWhereInput[]
    NOT?: TenantUsageWhereInput | TenantUsageWhereInput[]
    id?: StringFilter<"TenantUsage"> | string
    tenantId?: StringFilter<"TenantUsage"> | string
    date?: DateTimeFilter<"TenantUsage"> | Date | string
    dbSizeMB?: FloatFilter<"TenantUsage"> | number
    dbSizeBytes?: BigIntFilter<"TenantUsage"> | bigint | number
    apiRequests?: IntFilter<"TenantUsage"> | number
    apiRequestsByEndpoint?: JsonNullableFilter<"TenantUsage">
    storageSizeMB?: FloatFilter<"TenantUsage"> | number
    dbOverage?: BoolFilter<"TenantUsage"> | boolean
    apiOverage?: BoolFilter<"TenantUsage"> | boolean
    overageAmount?: FloatNullableFilter<"TenantUsage"> | number | null
    recordedAt?: DateTimeFilter<"TenantUsage"> | Date | string
    createdAt?: DateTimeFilter<"TenantUsage"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }

  export type TenantUsageOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    date?: SortOrder
    dbSizeMB?: SortOrder
    dbSizeBytes?: SortOrder
    apiRequests?: SortOrder
    apiRequestsByEndpoint?: SortOrderInput | SortOrder
    storageSizeMB?: SortOrder
    dbOverage?: SortOrder
    apiOverage?: SortOrder
    overageAmount?: SortOrderInput | SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type TenantUsageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    tenantId_date?: TenantUsageTenantIdDateCompoundUniqueInput
    AND?: TenantUsageWhereInput | TenantUsageWhereInput[]
    OR?: TenantUsageWhereInput[]
    NOT?: TenantUsageWhereInput | TenantUsageWhereInput[]
    tenantId?: StringFilter<"TenantUsage"> | string
    date?: DateTimeFilter<"TenantUsage"> | Date | string
    dbSizeMB?: FloatFilter<"TenantUsage"> | number
    dbSizeBytes?: BigIntFilter<"TenantUsage"> | bigint | number
    apiRequests?: IntFilter<"TenantUsage"> | number
    apiRequestsByEndpoint?: JsonNullableFilter<"TenantUsage">
    storageSizeMB?: FloatFilter<"TenantUsage"> | number
    dbOverage?: BoolFilter<"TenantUsage"> | boolean
    apiOverage?: BoolFilter<"TenantUsage"> | boolean
    overageAmount?: FloatNullableFilter<"TenantUsage"> | number | null
    recordedAt?: DateTimeFilter<"TenantUsage"> | Date | string
    createdAt?: DateTimeFilter<"TenantUsage"> | Date | string
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }, "id" | "tenantId_date">

  export type TenantUsageOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    date?: SortOrder
    dbSizeMB?: SortOrder
    dbSizeBytes?: SortOrder
    apiRequests?: SortOrder
    apiRequestsByEndpoint?: SortOrderInput | SortOrder
    storageSizeMB?: SortOrder
    dbOverage?: SortOrder
    apiOverage?: SortOrder
    overageAmount?: SortOrderInput | SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
    _count?: TenantUsageCountOrderByAggregateInput
    _avg?: TenantUsageAvgOrderByAggregateInput
    _max?: TenantUsageMaxOrderByAggregateInput
    _min?: TenantUsageMinOrderByAggregateInput
    _sum?: TenantUsageSumOrderByAggregateInput
  }

  export type TenantUsageScalarWhereWithAggregatesInput = {
    AND?: TenantUsageScalarWhereWithAggregatesInput | TenantUsageScalarWhereWithAggregatesInput[]
    OR?: TenantUsageScalarWhereWithAggregatesInput[]
    NOT?: TenantUsageScalarWhereWithAggregatesInput | TenantUsageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"TenantUsage"> | string
    tenantId?: StringWithAggregatesFilter<"TenantUsage"> | string
    date?: DateTimeWithAggregatesFilter<"TenantUsage"> | Date | string
    dbSizeMB?: FloatWithAggregatesFilter<"TenantUsage"> | number
    dbSizeBytes?: BigIntWithAggregatesFilter<"TenantUsage"> | bigint | number
    apiRequests?: IntWithAggregatesFilter<"TenantUsage"> | number
    apiRequestsByEndpoint?: JsonNullableWithAggregatesFilter<"TenantUsage">
    storageSizeMB?: FloatWithAggregatesFilter<"TenantUsage"> | number
    dbOverage?: BoolWithAggregatesFilter<"TenantUsage"> | boolean
    apiOverage?: BoolWithAggregatesFilter<"TenantUsage"> | boolean
    overageAmount?: FloatNullableWithAggregatesFilter<"TenantUsage"> | number | null
    recordedAt?: DateTimeWithAggregatesFilter<"TenantUsage"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"TenantUsage"> | Date | string
  }

  export type UsageAlertWhereInput = {
    AND?: UsageAlertWhereInput | UsageAlertWhereInput[]
    OR?: UsageAlertWhereInput[]
    NOT?: UsageAlertWhereInput | UsageAlertWhereInput[]
    id?: StringFilter<"UsageAlert"> | string
    tenantId?: StringFilter<"UsageAlert"> | string
    resource?: StringFilter<"UsageAlert"> | string
    level?: StringFilter<"UsageAlert"> | string
    percentage?: IntFilter<"UsageAlert"> | number
    current?: FloatFilter<"UsageAlert"> | number
    limit?: FloatFilter<"UsageAlert"> | number
    message?: StringFilter<"UsageAlert"> | string
    isRead?: BoolFilter<"UsageAlert"> | boolean
    isSent?: BoolFilter<"UsageAlert"> | boolean
    sentAt?: DateTimeNullableFilter<"UsageAlert"> | Date | string | null
    createdAt?: DateTimeFilter<"UsageAlert"> | Date | string
    resolvedAt?: DateTimeNullableFilter<"UsageAlert"> | Date | string | null
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }

  export type UsageAlertOrderByWithRelationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    resource?: SortOrder
    level?: SortOrder
    percentage?: SortOrder
    current?: SortOrder
    limit?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    isSent?: SortOrder
    sentAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    tenant?: TenantOrderByWithRelationInput
  }

  export type UsageAlertWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UsageAlertWhereInput | UsageAlertWhereInput[]
    OR?: UsageAlertWhereInput[]
    NOT?: UsageAlertWhereInput | UsageAlertWhereInput[]
    tenantId?: StringFilter<"UsageAlert"> | string
    resource?: StringFilter<"UsageAlert"> | string
    level?: StringFilter<"UsageAlert"> | string
    percentage?: IntFilter<"UsageAlert"> | number
    current?: FloatFilter<"UsageAlert"> | number
    limit?: FloatFilter<"UsageAlert"> | number
    message?: StringFilter<"UsageAlert"> | string
    isRead?: BoolFilter<"UsageAlert"> | boolean
    isSent?: BoolFilter<"UsageAlert"> | boolean
    sentAt?: DateTimeNullableFilter<"UsageAlert"> | Date | string | null
    createdAt?: DateTimeFilter<"UsageAlert"> | Date | string
    resolvedAt?: DateTimeNullableFilter<"UsageAlert"> | Date | string | null
    tenant?: XOR<TenantRelationFilter, TenantWhereInput>
  }, "id">

  export type UsageAlertOrderByWithAggregationInput = {
    id?: SortOrder
    tenantId?: SortOrder
    resource?: SortOrder
    level?: SortOrder
    percentage?: SortOrder
    current?: SortOrder
    limit?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    isSent?: SortOrder
    sentAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    resolvedAt?: SortOrderInput | SortOrder
    _count?: UsageAlertCountOrderByAggregateInput
    _avg?: UsageAlertAvgOrderByAggregateInput
    _max?: UsageAlertMaxOrderByAggregateInput
    _min?: UsageAlertMinOrderByAggregateInput
    _sum?: UsageAlertSumOrderByAggregateInput
  }

  export type UsageAlertScalarWhereWithAggregatesInput = {
    AND?: UsageAlertScalarWhereWithAggregatesInput | UsageAlertScalarWhereWithAggregatesInput[]
    OR?: UsageAlertScalarWhereWithAggregatesInput[]
    NOT?: UsageAlertScalarWhereWithAggregatesInput | UsageAlertScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UsageAlert"> | string
    tenantId?: StringWithAggregatesFilter<"UsageAlert"> | string
    resource?: StringWithAggregatesFilter<"UsageAlert"> | string
    level?: StringWithAggregatesFilter<"UsageAlert"> | string
    percentage?: IntWithAggregatesFilter<"UsageAlert"> | number
    current?: FloatWithAggregatesFilter<"UsageAlert"> | number
    limit?: FloatWithAggregatesFilter<"UsageAlert"> | number
    message?: StringWithAggregatesFilter<"UsageAlert"> | string
    isRead?: BoolWithAggregatesFilter<"UsageAlert"> | boolean
    isSent?: BoolWithAggregatesFilter<"UsageAlert"> | boolean
    sentAt?: DateTimeNullableWithAggregatesFilter<"UsageAlert"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"UsageAlert"> | Date | string
    resolvedAt?: DateTimeNullableWithAggregatesFilter<"UsageAlert"> | Date | string | null
  }

  export type TenantCreateInput = {
    id?: string
    slug: string
    businessName: string
    contactName: string
    contactEmail: string
    contactPhone?: string | null
    databaseUrl: string
    databaseHost: string
    databaseName: string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: $Enums.SubscriptionStatus
    trialEndsAt?: Date | string | null
    billingCycleStart?: Date | string | null
    billingCycleEnd?: Date | string | null
    monthlyFee?: number
    lastPaymentDate?: Date | string | null
    lastPaymentAmount?: number | null
    nextPaymentDue?: Date | string | null
    paymentNotes?: string | null
    customStorageLimitMB?: number | null
    customBandwidthLimitGB?: number | null
    customOrdersLimit?: number | null
    customStaffLimit?: number | null
    hasPrioritySupport?: boolean
    currentStorageUsageMB?: number
    currentBandwidthGB?: number
    currentMonthOrders?: number
    currentStaffCount?: number
    lastBillingCalculation?: Date | string | null
    lastMonthOverageCharges?: number
    lastMonthTotalBill?: number
    status?: $Enums.TenantStatus
    isActive?: boolean
    maxLocations?: number
    maxUsers?: number
    maxDbSizeMB?: number
    maxApiRequests?: number
    maxStorageMB?: number
    currentDbSizeMB?: number
    currentStorageMB?: number
    dbLimitExceeded?: boolean
    apiLimitExceeded?: boolean
    limitExceededAt?: Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activatedAt?: Date | string | null
    suspendedAt?: Date | string | null
    paymentRecords?: PaymentRecordCreateNestedManyWithoutTenantInput
    activityLogs?: TenantActivityLogCreateNestedManyWithoutTenantInput
    metrics?: TenantMetricsCreateNestedManyWithoutTenantInput
    usageHistory?: TenantUsageCreateNestedManyWithoutTenantInput
    usageAlerts?: UsageAlertCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateInput = {
    id?: string
    slug: string
    businessName: string
    contactName: string
    contactEmail: string
    contactPhone?: string | null
    databaseUrl: string
    databaseHost: string
    databaseName: string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: $Enums.SubscriptionStatus
    trialEndsAt?: Date | string | null
    billingCycleStart?: Date | string | null
    billingCycleEnd?: Date | string | null
    monthlyFee?: number
    lastPaymentDate?: Date | string | null
    lastPaymentAmount?: number | null
    nextPaymentDue?: Date | string | null
    paymentNotes?: string | null
    customStorageLimitMB?: number | null
    customBandwidthLimitGB?: number | null
    customOrdersLimit?: number | null
    customStaffLimit?: number | null
    hasPrioritySupport?: boolean
    currentStorageUsageMB?: number
    currentBandwidthGB?: number
    currentMonthOrders?: number
    currentStaffCount?: number
    lastBillingCalculation?: Date | string | null
    lastMonthOverageCharges?: number
    lastMonthTotalBill?: number
    status?: $Enums.TenantStatus
    isActive?: boolean
    maxLocations?: number
    maxUsers?: number
    maxDbSizeMB?: number
    maxApiRequests?: number
    maxStorageMB?: number
    currentDbSizeMB?: number
    currentStorageMB?: number
    dbLimitExceeded?: boolean
    apiLimitExceeded?: boolean
    limitExceededAt?: Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activatedAt?: Date | string | null
    suspendedAt?: Date | string | null
    paymentRecords?: PaymentRecordUncheckedCreateNestedManyWithoutTenantInput
    activityLogs?: TenantActivityLogUncheckedCreateNestedManyWithoutTenantInput
    metrics?: TenantMetricsUncheckedCreateNestedManyWithoutTenantInput
    usageHistory?: TenantUsageUncheckedCreateNestedManyWithoutTenantInput
    usageAlerts?: UsageAlertUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseUrl?: StringFieldUpdateOperationsInput | string
    databaseHost?: StringFieldUpdateOperationsInput | string
    databaseName?: StringFieldUpdateOperationsInput | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFee?: FloatFieldUpdateOperationsInput | number
    lastPaymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    nextPaymentDue?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentNotes?: NullableStringFieldUpdateOperationsInput | string | null
    customStorageLimitMB?: NullableIntFieldUpdateOperationsInput | number | null
    customBandwidthLimitGB?: NullableIntFieldUpdateOperationsInput | number | null
    customOrdersLimit?: NullableIntFieldUpdateOperationsInput | number | null
    customStaffLimit?: NullableIntFieldUpdateOperationsInput | number | null
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    currentStorageUsageMB?: FloatFieldUpdateOperationsInput | number
    currentBandwidthGB?: FloatFieldUpdateOperationsInput | number
    currentMonthOrders?: IntFieldUpdateOperationsInput | number
    currentStaffCount?: IntFieldUpdateOperationsInput | number
    lastBillingCalculation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMonthOverageCharges?: FloatFieldUpdateOperationsInput | number
    lastMonthTotalBill?: FloatFieldUpdateOperationsInput | number
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    maxLocations?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxDbSizeMB?: IntFieldUpdateOperationsInput | number
    maxApiRequests?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    currentDbSizeMB?: FloatFieldUpdateOperationsInput | number
    currentStorageMB?: FloatFieldUpdateOperationsInput | number
    dbLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    apiLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    limitExceededAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentRecords?: PaymentRecordUpdateManyWithoutTenantNestedInput
    activityLogs?: TenantActivityLogUpdateManyWithoutTenantNestedInput
    metrics?: TenantMetricsUpdateManyWithoutTenantNestedInput
    usageHistory?: TenantUsageUpdateManyWithoutTenantNestedInput
    usageAlerts?: UsageAlertUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseUrl?: StringFieldUpdateOperationsInput | string
    databaseHost?: StringFieldUpdateOperationsInput | string
    databaseName?: StringFieldUpdateOperationsInput | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFee?: FloatFieldUpdateOperationsInput | number
    lastPaymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    nextPaymentDue?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentNotes?: NullableStringFieldUpdateOperationsInput | string | null
    customStorageLimitMB?: NullableIntFieldUpdateOperationsInput | number | null
    customBandwidthLimitGB?: NullableIntFieldUpdateOperationsInput | number | null
    customOrdersLimit?: NullableIntFieldUpdateOperationsInput | number | null
    customStaffLimit?: NullableIntFieldUpdateOperationsInput | number | null
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    currentStorageUsageMB?: FloatFieldUpdateOperationsInput | number
    currentBandwidthGB?: FloatFieldUpdateOperationsInput | number
    currentMonthOrders?: IntFieldUpdateOperationsInput | number
    currentStaffCount?: IntFieldUpdateOperationsInput | number
    lastBillingCalculation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMonthOverageCharges?: FloatFieldUpdateOperationsInput | number
    lastMonthTotalBill?: FloatFieldUpdateOperationsInput | number
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    maxLocations?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxDbSizeMB?: IntFieldUpdateOperationsInput | number
    maxApiRequests?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    currentDbSizeMB?: FloatFieldUpdateOperationsInput | number
    currentStorageMB?: FloatFieldUpdateOperationsInput | number
    dbLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    apiLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    limitExceededAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentRecords?: PaymentRecordUncheckedUpdateManyWithoutTenantNestedInput
    activityLogs?: TenantActivityLogUncheckedUpdateManyWithoutTenantNestedInput
    metrics?: TenantMetricsUncheckedUpdateManyWithoutTenantNestedInput
    usageHistory?: TenantUsageUncheckedUpdateManyWithoutTenantNestedInput
    usageAlerts?: UsageAlertUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateManyInput = {
    id?: string
    slug: string
    businessName: string
    contactName: string
    contactEmail: string
    contactPhone?: string | null
    databaseUrl: string
    databaseHost: string
    databaseName: string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: $Enums.SubscriptionStatus
    trialEndsAt?: Date | string | null
    billingCycleStart?: Date | string | null
    billingCycleEnd?: Date | string | null
    monthlyFee?: number
    lastPaymentDate?: Date | string | null
    lastPaymentAmount?: number | null
    nextPaymentDue?: Date | string | null
    paymentNotes?: string | null
    customStorageLimitMB?: number | null
    customBandwidthLimitGB?: number | null
    customOrdersLimit?: number | null
    customStaffLimit?: number | null
    hasPrioritySupport?: boolean
    currentStorageUsageMB?: number
    currentBandwidthGB?: number
    currentMonthOrders?: number
    currentStaffCount?: number
    lastBillingCalculation?: Date | string | null
    lastMonthOverageCharges?: number
    lastMonthTotalBill?: number
    status?: $Enums.TenantStatus
    isActive?: boolean
    maxLocations?: number
    maxUsers?: number
    maxDbSizeMB?: number
    maxApiRequests?: number
    maxStorageMB?: number
    currentDbSizeMB?: number
    currentStorageMB?: number
    dbLimitExceeded?: boolean
    apiLimitExceeded?: boolean
    limitExceededAt?: Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activatedAt?: Date | string | null
    suspendedAt?: Date | string | null
  }

  export type TenantUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseUrl?: StringFieldUpdateOperationsInput | string
    databaseHost?: StringFieldUpdateOperationsInput | string
    databaseName?: StringFieldUpdateOperationsInput | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFee?: FloatFieldUpdateOperationsInput | number
    lastPaymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    nextPaymentDue?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentNotes?: NullableStringFieldUpdateOperationsInput | string | null
    customStorageLimitMB?: NullableIntFieldUpdateOperationsInput | number | null
    customBandwidthLimitGB?: NullableIntFieldUpdateOperationsInput | number | null
    customOrdersLimit?: NullableIntFieldUpdateOperationsInput | number | null
    customStaffLimit?: NullableIntFieldUpdateOperationsInput | number | null
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    currentStorageUsageMB?: FloatFieldUpdateOperationsInput | number
    currentBandwidthGB?: FloatFieldUpdateOperationsInput | number
    currentMonthOrders?: IntFieldUpdateOperationsInput | number
    currentStaffCount?: IntFieldUpdateOperationsInput | number
    lastBillingCalculation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMonthOverageCharges?: FloatFieldUpdateOperationsInput | number
    lastMonthTotalBill?: FloatFieldUpdateOperationsInput | number
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    maxLocations?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxDbSizeMB?: IntFieldUpdateOperationsInput | number
    maxApiRequests?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    currentDbSizeMB?: FloatFieldUpdateOperationsInput | number
    currentStorageMB?: FloatFieldUpdateOperationsInput | number
    dbLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    apiLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    limitExceededAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseUrl?: StringFieldUpdateOperationsInput | string
    databaseHost?: StringFieldUpdateOperationsInput | string
    databaseName?: StringFieldUpdateOperationsInput | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFee?: FloatFieldUpdateOperationsInput | number
    lastPaymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    nextPaymentDue?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentNotes?: NullableStringFieldUpdateOperationsInput | string | null
    customStorageLimitMB?: NullableIntFieldUpdateOperationsInput | number | null
    customBandwidthLimitGB?: NullableIntFieldUpdateOperationsInput | number | null
    customOrdersLimit?: NullableIntFieldUpdateOperationsInput | number | null
    customStaffLimit?: NullableIntFieldUpdateOperationsInput | number | null
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    currentStorageUsageMB?: FloatFieldUpdateOperationsInput | number
    currentBandwidthGB?: FloatFieldUpdateOperationsInput | number
    currentMonthOrders?: IntFieldUpdateOperationsInput | number
    currentStaffCount?: IntFieldUpdateOperationsInput | number
    lastBillingCalculation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMonthOverageCharges?: FloatFieldUpdateOperationsInput | number
    lastMonthTotalBill?: FloatFieldUpdateOperationsInput | number
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    maxLocations?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxDbSizeMB?: IntFieldUpdateOperationsInput | number
    maxApiRequests?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    currentDbSizeMB?: FloatFieldUpdateOperationsInput | number
    currentStorageMB?: FloatFieldUpdateOperationsInput | number
    dbLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    apiLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    limitExceededAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type PaymentRecordCreateInput = {
    id?: string
    amount: number
    paymentDate: Date | string
    paymentMethod: string
    referenceNumber?: string | null
    billingPeriodStart: Date | string
    billingPeriodEnd: Date | string
    notes?: string | null
    receivedBy: string
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutPaymentRecordsInput
  }

  export type PaymentRecordUncheckedCreateInput = {
    id?: string
    tenantId: string
    amount: number
    paymentDate: Date | string
    paymentMethod: string
    referenceNumber?: string | null
    billingPeriodStart: Date | string
    billingPeriodEnd: Date | string
    notes?: string | null
    receivedBy: string
    createdAt?: Date | string
  }

  export type PaymentRecordUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    referenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    billingPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    billingPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    receivedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutPaymentRecordsNestedInput
  }

  export type PaymentRecordUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    referenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    billingPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    billingPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    receivedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentRecordCreateManyInput = {
    id?: string
    tenantId: string
    amount: number
    paymentDate: Date | string
    paymentMethod: string
    referenceNumber?: string | null
    billingPeriodStart: Date | string
    billingPeriodEnd: Date | string
    notes?: string | null
    receivedBy: string
    createdAt?: Date | string
  }

  export type PaymentRecordUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    referenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    billingPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    billingPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    receivedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentRecordUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    referenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    billingPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    billingPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    receivedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SuperAdminCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.SuperAdminRole
    isActive?: boolean
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    lastFailedLogin?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    activityLogs?: TenantActivityLogCreateNestedManyWithoutSuperAdminInput
  }

  export type SuperAdminUncheckedCreateInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.SuperAdminRole
    isActive?: boolean
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    lastFailedLogin?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
    activityLogs?: TenantActivityLogUncheckedCreateNestedManyWithoutSuperAdminInput
  }

  export type SuperAdminUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumSuperAdminRoleFieldUpdateOperationsInput | $Enums.SuperAdminRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFailedLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activityLogs?: TenantActivityLogUpdateManyWithoutSuperAdminNestedInput
  }

  export type SuperAdminUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumSuperAdminRoleFieldUpdateOperationsInput | $Enums.SuperAdminRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFailedLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activityLogs?: TenantActivityLogUncheckedUpdateManyWithoutSuperAdminNestedInput
  }

  export type SuperAdminCreateManyInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.SuperAdminRole
    isActive?: boolean
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    lastFailedLogin?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
  }

  export type SuperAdminUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumSuperAdminRoleFieldUpdateOperationsInput | $Enums.SuperAdminRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFailedLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SuperAdminUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumSuperAdminRoleFieldUpdateOperationsInput | $Enums.SuperAdminRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFailedLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantActivityLogCreateInput = {
    id?: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutActivityLogsInput
    superAdmin?: SuperAdminCreateNestedOneWithoutActivityLogsInput
  }

  export type TenantActivityLogUncheckedCreateInput = {
    id?: string
    tenantId: string
    action: string
    performedBy?: string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type TenantActivityLogUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutActivityLogsNestedInput
    superAdmin?: SuperAdminUpdateOneWithoutActivityLogsNestedInput
  }

  export type TenantActivityLogUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantActivityLogCreateManyInput = {
    id?: string
    tenantId: string
    action: string
    performedBy?: string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type TenantActivityLogUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantActivityLogUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantMetricsCreateInput = {
    id?: string
    date: Date | string
    totalRevenue?: number
    totalOrders?: number
    activeUsers?: number
    activeLocations?: number
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutMetricsInput
  }

  export type TenantMetricsUncheckedCreateInput = {
    id?: string
    tenantId: string
    date: Date | string
    totalRevenue?: number
    totalOrders?: number
    activeUsers?: number
    activeLocations?: number
    createdAt?: Date | string
  }

  export type TenantMetricsUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRevenue?: FloatFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    activeUsers?: IntFieldUpdateOperationsInput | number
    activeLocations?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutMetricsNestedInput
  }

  export type TenantMetricsUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRevenue?: FloatFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    activeUsers?: IntFieldUpdateOperationsInput | number
    activeLocations?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantMetricsCreateManyInput = {
    id?: string
    tenantId: string
    date: Date | string
    totalRevenue?: number
    totalOrders?: number
    activeUsers?: number
    activeLocations?: number
    createdAt?: Date | string
  }

  export type TenantMetricsUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRevenue?: FloatFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    activeUsers?: IntFieldUpdateOperationsInput | number
    activeLocations?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantMetricsUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRevenue?: FloatFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    activeUsers?: IntFieldUpdateOperationsInput | number
    activeLocations?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUsageCreateInput = {
    id?: string
    date: Date | string
    dbSizeMB?: number
    dbSizeBytes?: bigint | number
    apiRequests?: number
    apiRequestsByEndpoint?: NullableJsonNullValueInput | InputJsonValue
    storageSizeMB?: number
    dbOverage?: boolean
    apiOverage?: boolean
    overageAmount?: number | null
    recordedAt?: Date | string
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutUsageHistoryInput
  }

  export type TenantUsageUncheckedCreateInput = {
    id?: string
    tenantId: string
    date: Date | string
    dbSizeMB?: number
    dbSizeBytes?: bigint | number
    apiRequests?: number
    apiRequestsByEndpoint?: NullableJsonNullValueInput | InputJsonValue
    storageSizeMB?: number
    dbOverage?: boolean
    apiOverage?: boolean
    overageAmount?: number | null
    recordedAt?: Date | string
    createdAt?: Date | string
  }

  export type TenantUsageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    dbSizeMB?: FloatFieldUpdateOperationsInput | number
    dbSizeBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    apiRequests?: IntFieldUpdateOperationsInput | number
    apiRequestsByEndpoint?: NullableJsonNullValueInput | InputJsonValue
    storageSizeMB?: FloatFieldUpdateOperationsInput | number
    dbOverage?: BoolFieldUpdateOperationsInput | boolean
    apiOverage?: BoolFieldUpdateOperationsInput | boolean
    overageAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutUsageHistoryNestedInput
  }

  export type TenantUsageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    dbSizeMB?: FloatFieldUpdateOperationsInput | number
    dbSizeBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    apiRequests?: IntFieldUpdateOperationsInput | number
    apiRequestsByEndpoint?: NullableJsonNullValueInput | InputJsonValue
    storageSizeMB?: FloatFieldUpdateOperationsInput | number
    dbOverage?: BoolFieldUpdateOperationsInput | boolean
    apiOverage?: BoolFieldUpdateOperationsInput | boolean
    overageAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUsageCreateManyInput = {
    id?: string
    tenantId: string
    date: Date | string
    dbSizeMB?: number
    dbSizeBytes?: bigint | number
    apiRequests?: number
    apiRequestsByEndpoint?: NullableJsonNullValueInput | InputJsonValue
    storageSizeMB?: number
    dbOverage?: boolean
    apiOverage?: boolean
    overageAmount?: number | null
    recordedAt?: Date | string
    createdAt?: Date | string
  }

  export type TenantUsageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    dbSizeMB?: FloatFieldUpdateOperationsInput | number
    dbSizeBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    apiRequests?: IntFieldUpdateOperationsInput | number
    apiRequestsByEndpoint?: NullableJsonNullValueInput | InputJsonValue
    storageSizeMB?: FloatFieldUpdateOperationsInput | number
    dbOverage?: BoolFieldUpdateOperationsInput | boolean
    apiOverage?: BoolFieldUpdateOperationsInput | boolean
    overageAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUsageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    dbSizeMB?: FloatFieldUpdateOperationsInput | number
    dbSizeBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    apiRequests?: IntFieldUpdateOperationsInput | number
    apiRequestsByEndpoint?: NullableJsonNullValueInput | InputJsonValue
    storageSizeMB?: FloatFieldUpdateOperationsInput | number
    dbOverage?: BoolFieldUpdateOperationsInput | boolean
    apiOverage?: BoolFieldUpdateOperationsInput | boolean
    overageAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageAlertCreateInput = {
    id?: string
    resource: string
    level: string
    percentage: number
    current: number
    limit: number
    message: string
    isRead?: boolean
    isSent?: boolean
    sentAt?: Date | string | null
    createdAt?: Date | string
    resolvedAt?: Date | string | null
    tenant: TenantCreateNestedOneWithoutUsageAlertsInput
  }

  export type UsageAlertUncheckedCreateInput = {
    id?: string
    tenantId: string
    resource: string
    level: string
    percentage: number
    current: number
    limit: number
    message: string
    isRead?: boolean
    isSent?: boolean
    sentAt?: Date | string | null
    createdAt?: Date | string
    resolvedAt?: Date | string | null
  }

  export type UsageAlertUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    percentage?: IntFieldUpdateOperationsInput | number
    current?: FloatFieldUpdateOperationsInput | number
    limit?: FloatFieldUpdateOperationsInput | number
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isSent?: BoolFieldUpdateOperationsInput | boolean
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tenant?: TenantUpdateOneRequiredWithoutUsageAlertsNestedInput
  }

  export type UsageAlertUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    percentage?: IntFieldUpdateOperationsInput | number
    current?: FloatFieldUpdateOperationsInput | number
    limit?: FloatFieldUpdateOperationsInput | number
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isSent?: BoolFieldUpdateOperationsInput | boolean
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UsageAlertCreateManyInput = {
    id?: string
    tenantId: string
    resource: string
    level: string
    percentage: number
    current: number
    limit: number
    message: string
    isRead?: boolean
    isSent?: boolean
    sentAt?: Date | string | null
    createdAt?: Date | string
    resolvedAt?: Date | string | null
  }

  export type UsageAlertUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    percentage?: IntFieldUpdateOperationsInput | number
    current?: FloatFieldUpdateOperationsInput | number
    limit?: FloatFieldUpdateOperationsInput | number
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isSent?: BoolFieldUpdateOperationsInput | boolean
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UsageAlertUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    percentage?: IntFieldUpdateOperationsInput | number
    current?: FloatFieldUpdateOperationsInput | number
    limit?: FloatFieldUpdateOperationsInput | number
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isSent?: BoolFieldUpdateOperationsInput | boolean
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type EnumSubscriptionTierFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionTier | EnumSubscriptionTierFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionTierFilter<$PrismaModel> | $Enums.SubscriptionTier
  }

  export type EnumSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusFilter<$PrismaModel> | $Enums.SubscriptionStatus
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type EnumTenantStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusFilter<$PrismaModel> | $Enums.TenantStatus
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PaymentRecordListRelationFilter = {
    every?: PaymentRecordWhereInput
    some?: PaymentRecordWhereInput
    none?: PaymentRecordWhereInput
  }

  export type TenantActivityLogListRelationFilter = {
    every?: TenantActivityLogWhereInput
    some?: TenantActivityLogWhereInput
    none?: TenantActivityLogWhereInput
  }

  export type TenantMetricsListRelationFilter = {
    every?: TenantMetricsWhereInput
    some?: TenantMetricsWhereInput
    none?: TenantMetricsWhereInput
  }

  export type TenantUsageListRelationFilter = {
    every?: TenantUsageWhereInput
    some?: TenantUsageWhereInput
    none?: TenantUsageWhereInput
  }

  export type UsageAlertListRelationFilter = {
    every?: UsageAlertWhereInput
    some?: UsageAlertWhereInput
    none?: UsageAlertWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PaymentRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantActivityLogOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantMetricsOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantUsageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UsageAlertOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TenantCountOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    businessName?: SortOrder
    contactName?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    databaseUrl?: SortOrder
    databaseHost?: SortOrder
    databaseName?: SortOrder
    subscriptionTier?: SortOrder
    subscriptionStatus?: SortOrder
    trialEndsAt?: SortOrder
    billingCycleStart?: SortOrder
    billingCycleEnd?: SortOrder
    monthlyFee?: SortOrder
    lastPaymentDate?: SortOrder
    lastPaymentAmount?: SortOrder
    nextPaymentDue?: SortOrder
    paymentNotes?: SortOrder
    customStorageLimitMB?: SortOrder
    customBandwidthLimitGB?: SortOrder
    customOrdersLimit?: SortOrder
    customStaffLimit?: SortOrder
    hasPrioritySupport?: SortOrder
    currentStorageUsageMB?: SortOrder
    currentBandwidthGB?: SortOrder
    currentMonthOrders?: SortOrder
    currentStaffCount?: SortOrder
    lastBillingCalculation?: SortOrder
    lastMonthOverageCharges?: SortOrder
    lastMonthTotalBill?: SortOrder
    status?: SortOrder
    isActive?: SortOrder
    maxLocations?: SortOrder
    maxUsers?: SortOrder
    maxDbSizeMB?: SortOrder
    maxApiRequests?: SortOrder
    maxStorageMB?: SortOrder
    currentDbSizeMB?: SortOrder
    currentStorageMB?: SortOrder
    dbLimitExceeded?: SortOrder
    apiLimitExceeded?: SortOrder
    limitExceededAt?: SortOrder
    features?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    activatedAt?: SortOrder
    suspendedAt?: SortOrder
  }

  export type TenantAvgOrderByAggregateInput = {
    monthlyFee?: SortOrder
    lastPaymentAmount?: SortOrder
    customStorageLimitMB?: SortOrder
    customBandwidthLimitGB?: SortOrder
    customOrdersLimit?: SortOrder
    customStaffLimit?: SortOrder
    currentStorageUsageMB?: SortOrder
    currentBandwidthGB?: SortOrder
    currentMonthOrders?: SortOrder
    currentStaffCount?: SortOrder
    lastMonthOverageCharges?: SortOrder
    lastMonthTotalBill?: SortOrder
    maxLocations?: SortOrder
    maxUsers?: SortOrder
    maxDbSizeMB?: SortOrder
    maxApiRequests?: SortOrder
    maxStorageMB?: SortOrder
    currentDbSizeMB?: SortOrder
    currentStorageMB?: SortOrder
  }

  export type TenantMaxOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    businessName?: SortOrder
    contactName?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    databaseUrl?: SortOrder
    databaseHost?: SortOrder
    databaseName?: SortOrder
    subscriptionTier?: SortOrder
    subscriptionStatus?: SortOrder
    trialEndsAt?: SortOrder
    billingCycleStart?: SortOrder
    billingCycleEnd?: SortOrder
    monthlyFee?: SortOrder
    lastPaymentDate?: SortOrder
    lastPaymentAmount?: SortOrder
    nextPaymentDue?: SortOrder
    paymentNotes?: SortOrder
    customStorageLimitMB?: SortOrder
    customBandwidthLimitGB?: SortOrder
    customOrdersLimit?: SortOrder
    customStaffLimit?: SortOrder
    hasPrioritySupport?: SortOrder
    currentStorageUsageMB?: SortOrder
    currentBandwidthGB?: SortOrder
    currentMonthOrders?: SortOrder
    currentStaffCount?: SortOrder
    lastBillingCalculation?: SortOrder
    lastMonthOverageCharges?: SortOrder
    lastMonthTotalBill?: SortOrder
    status?: SortOrder
    isActive?: SortOrder
    maxLocations?: SortOrder
    maxUsers?: SortOrder
    maxDbSizeMB?: SortOrder
    maxApiRequests?: SortOrder
    maxStorageMB?: SortOrder
    currentDbSizeMB?: SortOrder
    currentStorageMB?: SortOrder
    dbLimitExceeded?: SortOrder
    apiLimitExceeded?: SortOrder
    limitExceededAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    activatedAt?: SortOrder
    suspendedAt?: SortOrder
  }

  export type TenantMinOrderByAggregateInput = {
    id?: SortOrder
    slug?: SortOrder
    businessName?: SortOrder
    contactName?: SortOrder
    contactEmail?: SortOrder
    contactPhone?: SortOrder
    databaseUrl?: SortOrder
    databaseHost?: SortOrder
    databaseName?: SortOrder
    subscriptionTier?: SortOrder
    subscriptionStatus?: SortOrder
    trialEndsAt?: SortOrder
    billingCycleStart?: SortOrder
    billingCycleEnd?: SortOrder
    monthlyFee?: SortOrder
    lastPaymentDate?: SortOrder
    lastPaymentAmount?: SortOrder
    nextPaymentDue?: SortOrder
    paymentNotes?: SortOrder
    customStorageLimitMB?: SortOrder
    customBandwidthLimitGB?: SortOrder
    customOrdersLimit?: SortOrder
    customStaffLimit?: SortOrder
    hasPrioritySupport?: SortOrder
    currentStorageUsageMB?: SortOrder
    currentBandwidthGB?: SortOrder
    currentMonthOrders?: SortOrder
    currentStaffCount?: SortOrder
    lastBillingCalculation?: SortOrder
    lastMonthOverageCharges?: SortOrder
    lastMonthTotalBill?: SortOrder
    status?: SortOrder
    isActive?: SortOrder
    maxLocations?: SortOrder
    maxUsers?: SortOrder
    maxDbSizeMB?: SortOrder
    maxApiRequests?: SortOrder
    maxStorageMB?: SortOrder
    currentDbSizeMB?: SortOrder
    currentStorageMB?: SortOrder
    dbLimitExceeded?: SortOrder
    apiLimitExceeded?: SortOrder
    limitExceededAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    activatedAt?: SortOrder
    suspendedAt?: SortOrder
  }

  export type TenantSumOrderByAggregateInput = {
    monthlyFee?: SortOrder
    lastPaymentAmount?: SortOrder
    customStorageLimitMB?: SortOrder
    customBandwidthLimitGB?: SortOrder
    customOrdersLimit?: SortOrder
    customStaffLimit?: SortOrder
    currentStorageUsageMB?: SortOrder
    currentBandwidthGB?: SortOrder
    currentMonthOrders?: SortOrder
    currentStaffCount?: SortOrder
    lastMonthOverageCharges?: SortOrder
    lastMonthTotalBill?: SortOrder
    maxLocations?: SortOrder
    maxUsers?: SortOrder
    maxDbSizeMB?: SortOrder
    maxApiRequests?: SortOrder
    maxStorageMB?: SortOrder
    currentDbSizeMB?: SortOrder
    currentStorageMB?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumSubscriptionTierWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionTier | EnumSubscriptionTierFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionTierWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionTier
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionTierFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionTierFilter<$PrismaModel>
  }

  export type EnumSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type EnumTenantStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusWithAggregatesFilter<$PrismaModel> | $Enums.TenantStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTenantStatusFilter<$PrismaModel>
    _max?: NestedEnumTenantStatusFilter<$PrismaModel>
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type TenantRelationFilter = {
    is?: TenantWhereInput
    isNot?: TenantWhereInput
  }

  export type PaymentRecordCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    paymentDate?: SortOrder
    paymentMethod?: SortOrder
    referenceNumber?: SortOrder
    billingPeriodStart?: SortOrder
    billingPeriodEnd?: SortOrder
    notes?: SortOrder
    receivedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentRecordAvgOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type PaymentRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    paymentDate?: SortOrder
    paymentMethod?: SortOrder
    referenceNumber?: SortOrder
    billingPeriodStart?: SortOrder
    billingPeriodEnd?: SortOrder
    notes?: SortOrder
    receivedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentRecordMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    amount?: SortOrder
    paymentDate?: SortOrder
    paymentMethod?: SortOrder
    referenceNumber?: SortOrder
    billingPeriodStart?: SortOrder
    billingPeriodEnd?: SortOrder
    notes?: SortOrder
    receivedBy?: SortOrder
    createdAt?: SortOrder
  }

  export type PaymentRecordSumOrderByAggregateInput = {
    amount?: SortOrder
  }

  export type EnumSuperAdminRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.SuperAdminRole | EnumSuperAdminRoleFieldRefInput<$PrismaModel>
    in?: $Enums.SuperAdminRole[] | ListEnumSuperAdminRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.SuperAdminRole[] | ListEnumSuperAdminRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumSuperAdminRoleFilter<$PrismaModel> | $Enums.SuperAdminRole
  }

  export type SuperAdminCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrder
    lastFailedLogin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrder
  }

  export type SuperAdminAvgOrderByAggregateInput = {
    failedLoginAttempts?: SortOrder
  }

  export type SuperAdminMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrder
    lastFailedLogin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrder
  }

  export type SuperAdminMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    email?: SortOrder
    password?: SortOrder
    role?: SortOrder
    isActive?: SortOrder
    failedLoginAttempts?: SortOrder
    lockedUntil?: SortOrder
    lastFailedLogin?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    lastLoginAt?: SortOrder
  }

  export type SuperAdminSumOrderByAggregateInput = {
    failedLoginAttempts?: SortOrder
  }

  export type EnumSuperAdminRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SuperAdminRole | EnumSuperAdminRoleFieldRefInput<$PrismaModel>
    in?: $Enums.SuperAdminRole[] | ListEnumSuperAdminRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.SuperAdminRole[] | ListEnumSuperAdminRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumSuperAdminRoleWithAggregatesFilter<$PrismaModel> | $Enums.SuperAdminRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSuperAdminRoleFilter<$PrismaModel>
    _max?: NestedEnumSuperAdminRoleFilter<$PrismaModel>
  }

  export type SuperAdminNullableRelationFilter = {
    is?: SuperAdminWhereInput | null
    isNot?: SuperAdminWhereInput | null
  }

  export type TenantActivityLogCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    action?: SortOrder
    performedBy?: SortOrder
    details?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type TenantActivityLogMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    action?: SortOrder
    performedBy?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type TenantActivityLogMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    action?: SortOrder
    performedBy?: SortOrder
    ipAddress?: SortOrder
    createdAt?: SortOrder
  }

  export type TenantMetricsTenantIdDateCompoundUniqueInput = {
    tenantId: string
    date: Date | string
  }

  export type TenantMetricsCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    date?: SortOrder
    totalRevenue?: SortOrder
    totalOrders?: SortOrder
    activeUsers?: SortOrder
    activeLocations?: SortOrder
    createdAt?: SortOrder
  }

  export type TenantMetricsAvgOrderByAggregateInput = {
    totalRevenue?: SortOrder
    totalOrders?: SortOrder
    activeUsers?: SortOrder
    activeLocations?: SortOrder
  }

  export type TenantMetricsMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    date?: SortOrder
    totalRevenue?: SortOrder
    totalOrders?: SortOrder
    activeUsers?: SortOrder
    activeLocations?: SortOrder
    createdAt?: SortOrder
  }

  export type TenantMetricsMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    date?: SortOrder
    totalRevenue?: SortOrder
    totalOrders?: SortOrder
    activeUsers?: SortOrder
    activeLocations?: SortOrder
    createdAt?: SortOrder
  }

  export type TenantMetricsSumOrderByAggregateInput = {
    totalRevenue?: SortOrder
    totalOrders?: SortOrder
    activeUsers?: SortOrder
    activeLocations?: SortOrder
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type TenantUsageTenantIdDateCompoundUniqueInput = {
    tenantId: string
    date: Date | string
  }

  export type TenantUsageCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    date?: SortOrder
    dbSizeMB?: SortOrder
    dbSizeBytes?: SortOrder
    apiRequests?: SortOrder
    apiRequestsByEndpoint?: SortOrder
    storageSizeMB?: SortOrder
    dbOverage?: SortOrder
    apiOverage?: SortOrder
    overageAmount?: SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type TenantUsageAvgOrderByAggregateInput = {
    dbSizeMB?: SortOrder
    dbSizeBytes?: SortOrder
    apiRequests?: SortOrder
    storageSizeMB?: SortOrder
    overageAmount?: SortOrder
  }

  export type TenantUsageMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    date?: SortOrder
    dbSizeMB?: SortOrder
    dbSizeBytes?: SortOrder
    apiRequests?: SortOrder
    storageSizeMB?: SortOrder
    dbOverage?: SortOrder
    apiOverage?: SortOrder
    overageAmount?: SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type TenantUsageMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    date?: SortOrder
    dbSizeMB?: SortOrder
    dbSizeBytes?: SortOrder
    apiRequests?: SortOrder
    storageSizeMB?: SortOrder
    dbOverage?: SortOrder
    apiOverage?: SortOrder
    overageAmount?: SortOrder
    recordedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type TenantUsageSumOrderByAggregateInput = {
    dbSizeMB?: SortOrder
    dbSizeBytes?: SortOrder
    apiRequests?: SortOrder
    storageSizeMB?: SortOrder
    overageAmount?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type UsageAlertCountOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    resource?: SortOrder
    level?: SortOrder
    percentage?: SortOrder
    current?: SortOrder
    limit?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    isSent?: SortOrder
    sentAt?: SortOrder
    createdAt?: SortOrder
    resolvedAt?: SortOrder
  }

  export type UsageAlertAvgOrderByAggregateInput = {
    percentage?: SortOrder
    current?: SortOrder
    limit?: SortOrder
  }

  export type UsageAlertMaxOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    resource?: SortOrder
    level?: SortOrder
    percentage?: SortOrder
    current?: SortOrder
    limit?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    isSent?: SortOrder
    sentAt?: SortOrder
    createdAt?: SortOrder
    resolvedAt?: SortOrder
  }

  export type UsageAlertMinOrderByAggregateInput = {
    id?: SortOrder
    tenantId?: SortOrder
    resource?: SortOrder
    level?: SortOrder
    percentage?: SortOrder
    current?: SortOrder
    limit?: SortOrder
    message?: SortOrder
    isRead?: SortOrder
    isSent?: SortOrder
    sentAt?: SortOrder
    createdAt?: SortOrder
    resolvedAt?: SortOrder
  }

  export type UsageAlertSumOrderByAggregateInput = {
    percentage?: SortOrder
    current?: SortOrder
    limit?: SortOrder
  }

  export type PaymentRecordCreateNestedManyWithoutTenantInput = {
    create?: XOR<PaymentRecordCreateWithoutTenantInput, PaymentRecordUncheckedCreateWithoutTenantInput> | PaymentRecordCreateWithoutTenantInput[] | PaymentRecordUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PaymentRecordCreateOrConnectWithoutTenantInput | PaymentRecordCreateOrConnectWithoutTenantInput[]
    createMany?: PaymentRecordCreateManyTenantInputEnvelope
    connect?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
  }

  export type TenantActivityLogCreateNestedManyWithoutTenantInput = {
    create?: XOR<TenantActivityLogCreateWithoutTenantInput, TenantActivityLogUncheckedCreateWithoutTenantInput> | TenantActivityLogCreateWithoutTenantInput[] | TenantActivityLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantActivityLogCreateOrConnectWithoutTenantInput | TenantActivityLogCreateOrConnectWithoutTenantInput[]
    createMany?: TenantActivityLogCreateManyTenantInputEnvelope
    connect?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
  }

  export type TenantMetricsCreateNestedManyWithoutTenantInput = {
    create?: XOR<TenantMetricsCreateWithoutTenantInput, TenantMetricsUncheckedCreateWithoutTenantInput> | TenantMetricsCreateWithoutTenantInput[] | TenantMetricsUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantMetricsCreateOrConnectWithoutTenantInput | TenantMetricsCreateOrConnectWithoutTenantInput[]
    createMany?: TenantMetricsCreateManyTenantInputEnvelope
    connect?: TenantMetricsWhereUniqueInput | TenantMetricsWhereUniqueInput[]
  }

  export type TenantUsageCreateNestedManyWithoutTenantInput = {
    create?: XOR<TenantUsageCreateWithoutTenantInput, TenantUsageUncheckedCreateWithoutTenantInput> | TenantUsageCreateWithoutTenantInput[] | TenantUsageUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantUsageCreateOrConnectWithoutTenantInput | TenantUsageCreateOrConnectWithoutTenantInput[]
    createMany?: TenantUsageCreateManyTenantInputEnvelope
    connect?: TenantUsageWhereUniqueInput | TenantUsageWhereUniqueInput[]
  }

  export type UsageAlertCreateNestedManyWithoutTenantInput = {
    create?: XOR<UsageAlertCreateWithoutTenantInput, UsageAlertUncheckedCreateWithoutTenantInput> | UsageAlertCreateWithoutTenantInput[] | UsageAlertUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UsageAlertCreateOrConnectWithoutTenantInput | UsageAlertCreateOrConnectWithoutTenantInput[]
    createMany?: UsageAlertCreateManyTenantInputEnvelope
    connect?: UsageAlertWhereUniqueInput | UsageAlertWhereUniqueInput[]
  }

  export type PaymentRecordUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<PaymentRecordCreateWithoutTenantInput, PaymentRecordUncheckedCreateWithoutTenantInput> | PaymentRecordCreateWithoutTenantInput[] | PaymentRecordUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PaymentRecordCreateOrConnectWithoutTenantInput | PaymentRecordCreateOrConnectWithoutTenantInput[]
    createMany?: PaymentRecordCreateManyTenantInputEnvelope
    connect?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
  }

  export type TenantActivityLogUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<TenantActivityLogCreateWithoutTenantInput, TenantActivityLogUncheckedCreateWithoutTenantInput> | TenantActivityLogCreateWithoutTenantInput[] | TenantActivityLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantActivityLogCreateOrConnectWithoutTenantInput | TenantActivityLogCreateOrConnectWithoutTenantInput[]
    createMany?: TenantActivityLogCreateManyTenantInputEnvelope
    connect?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
  }

  export type TenantMetricsUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<TenantMetricsCreateWithoutTenantInput, TenantMetricsUncheckedCreateWithoutTenantInput> | TenantMetricsCreateWithoutTenantInput[] | TenantMetricsUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantMetricsCreateOrConnectWithoutTenantInput | TenantMetricsCreateOrConnectWithoutTenantInput[]
    createMany?: TenantMetricsCreateManyTenantInputEnvelope
    connect?: TenantMetricsWhereUniqueInput | TenantMetricsWhereUniqueInput[]
  }

  export type TenantUsageUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<TenantUsageCreateWithoutTenantInput, TenantUsageUncheckedCreateWithoutTenantInput> | TenantUsageCreateWithoutTenantInput[] | TenantUsageUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantUsageCreateOrConnectWithoutTenantInput | TenantUsageCreateOrConnectWithoutTenantInput[]
    createMany?: TenantUsageCreateManyTenantInputEnvelope
    connect?: TenantUsageWhereUniqueInput | TenantUsageWhereUniqueInput[]
  }

  export type UsageAlertUncheckedCreateNestedManyWithoutTenantInput = {
    create?: XOR<UsageAlertCreateWithoutTenantInput, UsageAlertUncheckedCreateWithoutTenantInput> | UsageAlertCreateWithoutTenantInput[] | UsageAlertUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UsageAlertCreateOrConnectWithoutTenantInput | UsageAlertCreateOrConnectWithoutTenantInput[]
    createMany?: UsageAlertCreateManyTenantInputEnvelope
    connect?: UsageAlertWhereUniqueInput | UsageAlertWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type EnumSubscriptionTierFieldUpdateOperationsInput = {
    set?: $Enums.SubscriptionTier
  }

  export type EnumSubscriptionStatusFieldUpdateOperationsInput = {
    set?: $Enums.SubscriptionStatus
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type EnumTenantStatusFieldUpdateOperationsInput = {
    set?: $Enums.TenantStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PaymentRecordUpdateManyWithoutTenantNestedInput = {
    create?: XOR<PaymentRecordCreateWithoutTenantInput, PaymentRecordUncheckedCreateWithoutTenantInput> | PaymentRecordCreateWithoutTenantInput[] | PaymentRecordUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PaymentRecordCreateOrConnectWithoutTenantInput | PaymentRecordCreateOrConnectWithoutTenantInput[]
    upsert?: PaymentRecordUpsertWithWhereUniqueWithoutTenantInput | PaymentRecordUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: PaymentRecordCreateManyTenantInputEnvelope
    set?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
    disconnect?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
    delete?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
    connect?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
    update?: PaymentRecordUpdateWithWhereUniqueWithoutTenantInput | PaymentRecordUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: PaymentRecordUpdateManyWithWhereWithoutTenantInput | PaymentRecordUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: PaymentRecordScalarWhereInput | PaymentRecordScalarWhereInput[]
  }

  export type TenantActivityLogUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TenantActivityLogCreateWithoutTenantInput, TenantActivityLogUncheckedCreateWithoutTenantInput> | TenantActivityLogCreateWithoutTenantInput[] | TenantActivityLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantActivityLogCreateOrConnectWithoutTenantInput | TenantActivityLogCreateOrConnectWithoutTenantInput[]
    upsert?: TenantActivityLogUpsertWithWhereUniqueWithoutTenantInput | TenantActivityLogUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantActivityLogCreateManyTenantInputEnvelope
    set?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
    disconnect?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
    delete?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
    connect?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
    update?: TenantActivityLogUpdateWithWhereUniqueWithoutTenantInput | TenantActivityLogUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TenantActivityLogUpdateManyWithWhereWithoutTenantInput | TenantActivityLogUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantActivityLogScalarWhereInput | TenantActivityLogScalarWhereInput[]
  }

  export type TenantMetricsUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TenantMetricsCreateWithoutTenantInput, TenantMetricsUncheckedCreateWithoutTenantInput> | TenantMetricsCreateWithoutTenantInput[] | TenantMetricsUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantMetricsCreateOrConnectWithoutTenantInput | TenantMetricsCreateOrConnectWithoutTenantInput[]
    upsert?: TenantMetricsUpsertWithWhereUniqueWithoutTenantInput | TenantMetricsUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantMetricsCreateManyTenantInputEnvelope
    set?: TenantMetricsWhereUniqueInput | TenantMetricsWhereUniqueInput[]
    disconnect?: TenantMetricsWhereUniqueInput | TenantMetricsWhereUniqueInput[]
    delete?: TenantMetricsWhereUniqueInput | TenantMetricsWhereUniqueInput[]
    connect?: TenantMetricsWhereUniqueInput | TenantMetricsWhereUniqueInput[]
    update?: TenantMetricsUpdateWithWhereUniqueWithoutTenantInput | TenantMetricsUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TenantMetricsUpdateManyWithWhereWithoutTenantInput | TenantMetricsUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantMetricsScalarWhereInput | TenantMetricsScalarWhereInput[]
  }

  export type TenantUsageUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TenantUsageCreateWithoutTenantInput, TenantUsageUncheckedCreateWithoutTenantInput> | TenantUsageCreateWithoutTenantInput[] | TenantUsageUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantUsageCreateOrConnectWithoutTenantInput | TenantUsageCreateOrConnectWithoutTenantInput[]
    upsert?: TenantUsageUpsertWithWhereUniqueWithoutTenantInput | TenantUsageUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantUsageCreateManyTenantInputEnvelope
    set?: TenantUsageWhereUniqueInput | TenantUsageWhereUniqueInput[]
    disconnect?: TenantUsageWhereUniqueInput | TenantUsageWhereUniqueInput[]
    delete?: TenantUsageWhereUniqueInput | TenantUsageWhereUniqueInput[]
    connect?: TenantUsageWhereUniqueInput | TenantUsageWhereUniqueInput[]
    update?: TenantUsageUpdateWithWhereUniqueWithoutTenantInput | TenantUsageUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TenantUsageUpdateManyWithWhereWithoutTenantInput | TenantUsageUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantUsageScalarWhereInput | TenantUsageScalarWhereInput[]
  }

  export type UsageAlertUpdateManyWithoutTenantNestedInput = {
    create?: XOR<UsageAlertCreateWithoutTenantInput, UsageAlertUncheckedCreateWithoutTenantInput> | UsageAlertCreateWithoutTenantInput[] | UsageAlertUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UsageAlertCreateOrConnectWithoutTenantInput | UsageAlertCreateOrConnectWithoutTenantInput[]
    upsert?: UsageAlertUpsertWithWhereUniqueWithoutTenantInput | UsageAlertUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: UsageAlertCreateManyTenantInputEnvelope
    set?: UsageAlertWhereUniqueInput | UsageAlertWhereUniqueInput[]
    disconnect?: UsageAlertWhereUniqueInput | UsageAlertWhereUniqueInput[]
    delete?: UsageAlertWhereUniqueInput | UsageAlertWhereUniqueInput[]
    connect?: UsageAlertWhereUniqueInput | UsageAlertWhereUniqueInput[]
    update?: UsageAlertUpdateWithWhereUniqueWithoutTenantInput | UsageAlertUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: UsageAlertUpdateManyWithWhereWithoutTenantInput | UsageAlertUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: UsageAlertScalarWhereInput | UsageAlertScalarWhereInput[]
  }

  export type PaymentRecordUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<PaymentRecordCreateWithoutTenantInput, PaymentRecordUncheckedCreateWithoutTenantInput> | PaymentRecordCreateWithoutTenantInput[] | PaymentRecordUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: PaymentRecordCreateOrConnectWithoutTenantInput | PaymentRecordCreateOrConnectWithoutTenantInput[]
    upsert?: PaymentRecordUpsertWithWhereUniqueWithoutTenantInput | PaymentRecordUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: PaymentRecordCreateManyTenantInputEnvelope
    set?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
    disconnect?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
    delete?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
    connect?: PaymentRecordWhereUniqueInput | PaymentRecordWhereUniqueInput[]
    update?: PaymentRecordUpdateWithWhereUniqueWithoutTenantInput | PaymentRecordUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: PaymentRecordUpdateManyWithWhereWithoutTenantInput | PaymentRecordUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: PaymentRecordScalarWhereInput | PaymentRecordScalarWhereInput[]
  }

  export type TenantActivityLogUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TenantActivityLogCreateWithoutTenantInput, TenantActivityLogUncheckedCreateWithoutTenantInput> | TenantActivityLogCreateWithoutTenantInput[] | TenantActivityLogUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantActivityLogCreateOrConnectWithoutTenantInput | TenantActivityLogCreateOrConnectWithoutTenantInput[]
    upsert?: TenantActivityLogUpsertWithWhereUniqueWithoutTenantInput | TenantActivityLogUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantActivityLogCreateManyTenantInputEnvelope
    set?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
    disconnect?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
    delete?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
    connect?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
    update?: TenantActivityLogUpdateWithWhereUniqueWithoutTenantInput | TenantActivityLogUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TenantActivityLogUpdateManyWithWhereWithoutTenantInput | TenantActivityLogUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantActivityLogScalarWhereInput | TenantActivityLogScalarWhereInput[]
  }

  export type TenantMetricsUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TenantMetricsCreateWithoutTenantInput, TenantMetricsUncheckedCreateWithoutTenantInput> | TenantMetricsCreateWithoutTenantInput[] | TenantMetricsUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantMetricsCreateOrConnectWithoutTenantInput | TenantMetricsCreateOrConnectWithoutTenantInput[]
    upsert?: TenantMetricsUpsertWithWhereUniqueWithoutTenantInput | TenantMetricsUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantMetricsCreateManyTenantInputEnvelope
    set?: TenantMetricsWhereUniqueInput | TenantMetricsWhereUniqueInput[]
    disconnect?: TenantMetricsWhereUniqueInput | TenantMetricsWhereUniqueInput[]
    delete?: TenantMetricsWhereUniqueInput | TenantMetricsWhereUniqueInput[]
    connect?: TenantMetricsWhereUniqueInput | TenantMetricsWhereUniqueInput[]
    update?: TenantMetricsUpdateWithWhereUniqueWithoutTenantInput | TenantMetricsUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TenantMetricsUpdateManyWithWhereWithoutTenantInput | TenantMetricsUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantMetricsScalarWhereInput | TenantMetricsScalarWhereInput[]
  }

  export type TenantUsageUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<TenantUsageCreateWithoutTenantInput, TenantUsageUncheckedCreateWithoutTenantInput> | TenantUsageCreateWithoutTenantInput[] | TenantUsageUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: TenantUsageCreateOrConnectWithoutTenantInput | TenantUsageCreateOrConnectWithoutTenantInput[]
    upsert?: TenantUsageUpsertWithWhereUniqueWithoutTenantInput | TenantUsageUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: TenantUsageCreateManyTenantInputEnvelope
    set?: TenantUsageWhereUniqueInput | TenantUsageWhereUniqueInput[]
    disconnect?: TenantUsageWhereUniqueInput | TenantUsageWhereUniqueInput[]
    delete?: TenantUsageWhereUniqueInput | TenantUsageWhereUniqueInput[]
    connect?: TenantUsageWhereUniqueInput | TenantUsageWhereUniqueInput[]
    update?: TenantUsageUpdateWithWhereUniqueWithoutTenantInput | TenantUsageUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: TenantUsageUpdateManyWithWhereWithoutTenantInput | TenantUsageUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: TenantUsageScalarWhereInput | TenantUsageScalarWhereInput[]
  }

  export type UsageAlertUncheckedUpdateManyWithoutTenantNestedInput = {
    create?: XOR<UsageAlertCreateWithoutTenantInput, UsageAlertUncheckedCreateWithoutTenantInput> | UsageAlertCreateWithoutTenantInput[] | UsageAlertUncheckedCreateWithoutTenantInput[]
    connectOrCreate?: UsageAlertCreateOrConnectWithoutTenantInput | UsageAlertCreateOrConnectWithoutTenantInput[]
    upsert?: UsageAlertUpsertWithWhereUniqueWithoutTenantInput | UsageAlertUpsertWithWhereUniqueWithoutTenantInput[]
    createMany?: UsageAlertCreateManyTenantInputEnvelope
    set?: UsageAlertWhereUniqueInput | UsageAlertWhereUniqueInput[]
    disconnect?: UsageAlertWhereUniqueInput | UsageAlertWhereUniqueInput[]
    delete?: UsageAlertWhereUniqueInput | UsageAlertWhereUniqueInput[]
    connect?: UsageAlertWhereUniqueInput | UsageAlertWhereUniqueInput[]
    update?: UsageAlertUpdateWithWhereUniqueWithoutTenantInput | UsageAlertUpdateWithWhereUniqueWithoutTenantInput[]
    updateMany?: UsageAlertUpdateManyWithWhereWithoutTenantInput | UsageAlertUpdateManyWithWhereWithoutTenantInput[]
    deleteMany?: UsageAlertScalarWhereInput | UsageAlertScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutPaymentRecordsInput = {
    create?: XOR<TenantCreateWithoutPaymentRecordsInput, TenantUncheckedCreateWithoutPaymentRecordsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutPaymentRecordsInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutPaymentRecordsNestedInput = {
    create?: XOR<TenantCreateWithoutPaymentRecordsInput, TenantUncheckedCreateWithoutPaymentRecordsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutPaymentRecordsInput
    upsert?: TenantUpsertWithoutPaymentRecordsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutPaymentRecordsInput, TenantUpdateWithoutPaymentRecordsInput>, TenantUncheckedUpdateWithoutPaymentRecordsInput>
  }

  export type TenantActivityLogCreateNestedManyWithoutSuperAdminInput = {
    create?: XOR<TenantActivityLogCreateWithoutSuperAdminInput, TenantActivityLogUncheckedCreateWithoutSuperAdminInput> | TenantActivityLogCreateWithoutSuperAdminInput[] | TenantActivityLogUncheckedCreateWithoutSuperAdminInput[]
    connectOrCreate?: TenantActivityLogCreateOrConnectWithoutSuperAdminInput | TenantActivityLogCreateOrConnectWithoutSuperAdminInput[]
    createMany?: TenantActivityLogCreateManySuperAdminInputEnvelope
    connect?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
  }

  export type TenantActivityLogUncheckedCreateNestedManyWithoutSuperAdminInput = {
    create?: XOR<TenantActivityLogCreateWithoutSuperAdminInput, TenantActivityLogUncheckedCreateWithoutSuperAdminInput> | TenantActivityLogCreateWithoutSuperAdminInput[] | TenantActivityLogUncheckedCreateWithoutSuperAdminInput[]
    connectOrCreate?: TenantActivityLogCreateOrConnectWithoutSuperAdminInput | TenantActivityLogCreateOrConnectWithoutSuperAdminInput[]
    createMany?: TenantActivityLogCreateManySuperAdminInputEnvelope
    connect?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
  }

  export type EnumSuperAdminRoleFieldUpdateOperationsInput = {
    set?: $Enums.SuperAdminRole
  }

  export type TenantActivityLogUpdateManyWithoutSuperAdminNestedInput = {
    create?: XOR<TenantActivityLogCreateWithoutSuperAdminInput, TenantActivityLogUncheckedCreateWithoutSuperAdminInput> | TenantActivityLogCreateWithoutSuperAdminInput[] | TenantActivityLogUncheckedCreateWithoutSuperAdminInput[]
    connectOrCreate?: TenantActivityLogCreateOrConnectWithoutSuperAdminInput | TenantActivityLogCreateOrConnectWithoutSuperAdminInput[]
    upsert?: TenantActivityLogUpsertWithWhereUniqueWithoutSuperAdminInput | TenantActivityLogUpsertWithWhereUniqueWithoutSuperAdminInput[]
    createMany?: TenantActivityLogCreateManySuperAdminInputEnvelope
    set?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
    disconnect?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
    delete?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
    connect?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
    update?: TenantActivityLogUpdateWithWhereUniqueWithoutSuperAdminInput | TenantActivityLogUpdateWithWhereUniqueWithoutSuperAdminInput[]
    updateMany?: TenantActivityLogUpdateManyWithWhereWithoutSuperAdminInput | TenantActivityLogUpdateManyWithWhereWithoutSuperAdminInput[]
    deleteMany?: TenantActivityLogScalarWhereInput | TenantActivityLogScalarWhereInput[]
  }

  export type TenantActivityLogUncheckedUpdateManyWithoutSuperAdminNestedInput = {
    create?: XOR<TenantActivityLogCreateWithoutSuperAdminInput, TenantActivityLogUncheckedCreateWithoutSuperAdminInput> | TenantActivityLogCreateWithoutSuperAdminInput[] | TenantActivityLogUncheckedCreateWithoutSuperAdminInput[]
    connectOrCreate?: TenantActivityLogCreateOrConnectWithoutSuperAdminInput | TenantActivityLogCreateOrConnectWithoutSuperAdminInput[]
    upsert?: TenantActivityLogUpsertWithWhereUniqueWithoutSuperAdminInput | TenantActivityLogUpsertWithWhereUniqueWithoutSuperAdminInput[]
    createMany?: TenantActivityLogCreateManySuperAdminInputEnvelope
    set?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
    disconnect?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
    delete?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
    connect?: TenantActivityLogWhereUniqueInput | TenantActivityLogWhereUniqueInput[]
    update?: TenantActivityLogUpdateWithWhereUniqueWithoutSuperAdminInput | TenantActivityLogUpdateWithWhereUniqueWithoutSuperAdminInput[]
    updateMany?: TenantActivityLogUpdateManyWithWhereWithoutSuperAdminInput | TenantActivityLogUpdateManyWithWhereWithoutSuperAdminInput[]
    deleteMany?: TenantActivityLogScalarWhereInput | TenantActivityLogScalarWhereInput[]
  }

  export type TenantCreateNestedOneWithoutActivityLogsInput = {
    create?: XOR<TenantCreateWithoutActivityLogsInput, TenantUncheckedCreateWithoutActivityLogsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutActivityLogsInput
    connect?: TenantWhereUniqueInput
  }

  export type SuperAdminCreateNestedOneWithoutActivityLogsInput = {
    create?: XOR<SuperAdminCreateWithoutActivityLogsInput, SuperAdminUncheckedCreateWithoutActivityLogsInput>
    connectOrCreate?: SuperAdminCreateOrConnectWithoutActivityLogsInput
    connect?: SuperAdminWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutActivityLogsNestedInput = {
    create?: XOR<TenantCreateWithoutActivityLogsInput, TenantUncheckedCreateWithoutActivityLogsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutActivityLogsInput
    upsert?: TenantUpsertWithoutActivityLogsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutActivityLogsInput, TenantUpdateWithoutActivityLogsInput>, TenantUncheckedUpdateWithoutActivityLogsInput>
  }

  export type SuperAdminUpdateOneWithoutActivityLogsNestedInput = {
    create?: XOR<SuperAdminCreateWithoutActivityLogsInput, SuperAdminUncheckedCreateWithoutActivityLogsInput>
    connectOrCreate?: SuperAdminCreateOrConnectWithoutActivityLogsInput
    upsert?: SuperAdminUpsertWithoutActivityLogsInput
    disconnect?: SuperAdminWhereInput | boolean
    delete?: SuperAdminWhereInput | boolean
    connect?: SuperAdminWhereUniqueInput
    update?: XOR<XOR<SuperAdminUpdateToOneWithWhereWithoutActivityLogsInput, SuperAdminUpdateWithoutActivityLogsInput>, SuperAdminUncheckedUpdateWithoutActivityLogsInput>
  }

  export type TenantCreateNestedOneWithoutMetricsInput = {
    create?: XOR<TenantCreateWithoutMetricsInput, TenantUncheckedCreateWithoutMetricsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutMetricsInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutMetricsNestedInput = {
    create?: XOR<TenantCreateWithoutMetricsInput, TenantUncheckedCreateWithoutMetricsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutMetricsInput
    upsert?: TenantUpsertWithoutMetricsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutMetricsInput, TenantUpdateWithoutMetricsInput>, TenantUncheckedUpdateWithoutMetricsInput>
  }

  export type TenantCreateNestedOneWithoutUsageHistoryInput = {
    create?: XOR<TenantCreateWithoutUsageHistoryInput, TenantUncheckedCreateWithoutUsageHistoryInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsageHistoryInput
    connect?: TenantWhereUniqueInput
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type TenantUpdateOneRequiredWithoutUsageHistoryNestedInput = {
    create?: XOR<TenantCreateWithoutUsageHistoryInput, TenantUncheckedCreateWithoutUsageHistoryInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsageHistoryInput
    upsert?: TenantUpsertWithoutUsageHistoryInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutUsageHistoryInput, TenantUpdateWithoutUsageHistoryInput>, TenantUncheckedUpdateWithoutUsageHistoryInput>
  }

  export type TenantCreateNestedOneWithoutUsageAlertsInput = {
    create?: XOR<TenantCreateWithoutUsageAlertsInput, TenantUncheckedCreateWithoutUsageAlertsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsageAlertsInput
    connect?: TenantWhereUniqueInput
  }

  export type TenantUpdateOneRequiredWithoutUsageAlertsNestedInput = {
    create?: XOR<TenantCreateWithoutUsageAlertsInput, TenantUncheckedCreateWithoutUsageAlertsInput>
    connectOrCreate?: TenantCreateOrConnectWithoutUsageAlertsInput
    upsert?: TenantUpsertWithoutUsageAlertsInput
    connect?: TenantWhereUniqueInput
    update?: XOR<XOR<TenantUpdateToOneWithWhereWithoutUsageAlertsInput, TenantUpdateWithoutUsageAlertsInput>, TenantUncheckedUpdateWithoutUsageAlertsInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumSubscriptionTierFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionTier | EnumSubscriptionTierFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionTierFilter<$PrismaModel> | $Enums.SubscriptionTier
  }

  export type NestedEnumSubscriptionStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusFilter<$PrismaModel> | $Enums.SubscriptionStatus
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumTenantStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusFilter<$PrismaModel> | $Enums.TenantStatus
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumSubscriptionTierWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionTier | EnumSubscriptionTierFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionTier[] | ListEnumSubscriptionTierFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionTierWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionTier
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionTierFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionTierFilter<$PrismaModel>
  }

  export type NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SubscriptionStatus | EnumSubscriptionStatusFieldRefInput<$PrismaModel>
    in?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.SubscriptionStatus[] | ListEnumSubscriptionStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumSubscriptionStatusWithAggregatesFilter<$PrismaModel> | $Enums.SubscriptionStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
    _max?: NestedEnumSubscriptionStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedEnumTenantStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.TenantStatus | EnumTenantStatusFieldRefInput<$PrismaModel>
    in?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.TenantStatus[] | ListEnumTenantStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumTenantStatusWithAggregatesFilter<$PrismaModel> | $Enums.TenantStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumTenantStatusFilter<$PrismaModel>
    _max?: NestedEnumTenantStatusFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedEnumSuperAdminRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.SuperAdminRole | EnumSuperAdminRoleFieldRefInput<$PrismaModel>
    in?: $Enums.SuperAdminRole[] | ListEnumSuperAdminRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.SuperAdminRole[] | ListEnumSuperAdminRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumSuperAdminRoleFilter<$PrismaModel> | $Enums.SuperAdminRole
  }

  export type NestedEnumSuperAdminRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.SuperAdminRole | EnumSuperAdminRoleFieldRefInput<$PrismaModel>
    in?: $Enums.SuperAdminRole[] | ListEnumSuperAdminRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.SuperAdminRole[] | ListEnumSuperAdminRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumSuperAdminRoleWithAggregatesFilter<$PrismaModel> | $Enums.SuperAdminRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumSuperAdminRoleFilter<$PrismaModel>
    _max?: NestedEnumSuperAdminRoleFilter<$PrismaModel>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    notIn?: bigint[] | number[] | ListBigIntFieldRefInput<$PrismaModel>
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type PaymentRecordCreateWithoutTenantInput = {
    id?: string
    amount: number
    paymentDate: Date | string
    paymentMethod: string
    referenceNumber?: string | null
    billingPeriodStart: Date | string
    billingPeriodEnd: Date | string
    notes?: string | null
    receivedBy: string
    createdAt?: Date | string
  }

  export type PaymentRecordUncheckedCreateWithoutTenantInput = {
    id?: string
    amount: number
    paymentDate: Date | string
    paymentMethod: string
    referenceNumber?: string | null
    billingPeriodStart: Date | string
    billingPeriodEnd: Date | string
    notes?: string | null
    receivedBy: string
    createdAt?: Date | string
  }

  export type PaymentRecordCreateOrConnectWithoutTenantInput = {
    where: PaymentRecordWhereUniqueInput
    create: XOR<PaymentRecordCreateWithoutTenantInput, PaymentRecordUncheckedCreateWithoutTenantInput>
  }

  export type PaymentRecordCreateManyTenantInputEnvelope = {
    data: PaymentRecordCreateManyTenantInput | PaymentRecordCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type TenantActivityLogCreateWithoutTenantInput = {
    id?: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
    superAdmin?: SuperAdminCreateNestedOneWithoutActivityLogsInput
  }

  export type TenantActivityLogUncheckedCreateWithoutTenantInput = {
    id?: string
    action: string
    performedBy?: string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type TenantActivityLogCreateOrConnectWithoutTenantInput = {
    where: TenantActivityLogWhereUniqueInput
    create: XOR<TenantActivityLogCreateWithoutTenantInput, TenantActivityLogUncheckedCreateWithoutTenantInput>
  }

  export type TenantActivityLogCreateManyTenantInputEnvelope = {
    data: TenantActivityLogCreateManyTenantInput | TenantActivityLogCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type TenantMetricsCreateWithoutTenantInput = {
    id?: string
    date: Date | string
    totalRevenue?: number
    totalOrders?: number
    activeUsers?: number
    activeLocations?: number
    createdAt?: Date | string
  }

  export type TenantMetricsUncheckedCreateWithoutTenantInput = {
    id?: string
    date: Date | string
    totalRevenue?: number
    totalOrders?: number
    activeUsers?: number
    activeLocations?: number
    createdAt?: Date | string
  }

  export type TenantMetricsCreateOrConnectWithoutTenantInput = {
    where: TenantMetricsWhereUniqueInput
    create: XOR<TenantMetricsCreateWithoutTenantInput, TenantMetricsUncheckedCreateWithoutTenantInput>
  }

  export type TenantMetricsCreateManyTenantInputEnvelope = {
    data: TenantMetricsCreateManyTenantInput | TenantMetricsCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type TenantUsageCreateWithoutTenantInput = {
    id?: string
    date: Date | string
    dbSizeMB?: number
    dbSizeBytes?: bigint | number
    apiRequests?: number
    apiRequestsByEndpoint?: NullableJsonNullValueInput | InputJsonValue
    storageSizeMB?: number
    dbOverage?: boolean
    apiOverage?: boolean
    overageAmount?: number | null
    recordedAt?: Date | string
    createdAt?: Date | string
  }

  export type TenantUsageUncheckedCreateWithoutTenantInput = {
    id?: string
    date: Date | string
    dbSizeMB?: number
    dbSizeBytes?: bigint | number
    apiRequests?: number
    apiRequestsByEndpoint?: NullableJsonNullValueInput | InputJsonValue
    storageSizeMB?: number
    dbOverage?: boolean
    apiOverage?: boolean
    overageAmount?: number | null
    recordedAt?: Date | string
    createdAt?: Date | string
  }

  export type TenantUsageCreateOrConnectWithoutTenantInput = {
    where: TenantUsageWhereUniqueInput
    create: XOR<TenantUsageCreateWithoutTenantInput, TenantUsageUncheckedCreateWithoutTenantInput>
  }

  export type TenantUsageCreateManyTenantInputEnvelope = {
    data: TenantUsageCreateManyTenantInput | TenantUsageCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type UsageAlertCreateWithoutTenantInput = {
    id?: string
    resource: string
    level: string
    percentage: number
    current: number
    limit: number
    message: string
    isRead?: boolean
    isSent?: boolean
    sentAt?: Date | string | null
    createdAt?: Date | string
    resolvedAt?: Date | string | null
  }

  export type UsageAlertUncheckedCreateWithoutTenantInput = {
    id?: string
    resource: string
    level: string
    percentage: number
    current: number
    limit: number
    message: string
    isRead?: boolean
    isSent?: boolean
    sentAt?: Date | string | null
    createdAt?: Date | string
    resolvedAt?: Date | string | null
  }

  export type UsageAlertCreateOrConnectWithoutTenantInput = {
    where: UsageAlertWhereUniqueInput
    create: XOR<UsageAlertCreateWithoutTenantInput, UsageAlertUncheckedCreateWithoutTenantInput>
  }

  export type UsageAlertCreateManyTenantInputEnvelope = {
    data: UsageAlertCreateManyTenantInput | UsageAlertCreateManyTenantInput[]
    skipDuplicates?: boolean
  }

  export type PaymentRecordUpsertWithWhereUniqueWithoutTenantInput = {
    where: PaymentRecordWhereUniqueInput
    update: XOR<PaymentRecordUpdateWithoutTenantInput, PaymentRecordUncheckedUpdateWithoutTenantInput>
    create: XOR<PaymentRecordCreateWithoutTenantInput, PaymentRecordUncheckedCreateWithoutTenantInput>
  }

  export type PaymentRecordUpdateWithWhereUniqueWithoutTenantInput = {
    where: PaymentRecordWhereUniqueInput
    data: XOR<PaymentRecordUpdateWithoutTenantInput, PaymentRecordUncheckedUpdateWithoutTenantInput>
  }

  export type PaymentRecordUpdateManyWithWhereWithoutTenantInput = {
    where: PaymentRecordScalarWhereInput
    data: XOR<PaymentRecordUpdateManyMutationInput, PaymentRecordUncheckedUpdateManyWithoutTenantInput>
  }

  export type PaymentRecordScalarWhereInput = {
    AND?: PaymentRecordScalarWhereInput | PaymentRecordScalarWhereInput[]
    OR?: PaymentRecordScalarWhereInput[]
    NOT?: PaymentRecordScalarWhereInput | PaymentRecordScalarWhereInput[]
    id?: StringFilter<"PaymentRecord"> | string
    tenantId?: StringFilter<"PaymentRecord"> | string
    amount?: FloatFilter<"PaymentRecord"> | number
    paymentDate?: DateTimeFilter<"PaymentRecord"> | Date | string
    paymentMethod?: StringFilter<"PaymentRecord"> | string
    referenceNumber?: StringNullableFilter<"PaymentRecord"> | string | null
    billingPeriodStart?: DateTimeFilter<"PaymentRecord"> | Date | string
    billingPeriodEnd?: DateTimeFilter<"PaymentRecord"> | Date | string
    notes?: StringNullableFilter<"PaymentRecord"> | string | null
    receivedBy?: StringFilter<"PaymentRecord"> | string
    createdAt?: DateTimeFilter<"PaymentRecord"> | Date | string
  }

  export type TenantActivityLogUpsertWithWhereUniqueWithoutTenantInput = {
    where: TenantActivityLogWhereUniqueInput
    update: XOR<TenantActivityLogUpdateWithoutTenantInput, TenantActivityLogUncheckedUpdateWithoutTenantInput>
    create: XOR<TenantActivityLogCreateWithoutTenantInput, TenantActivityLogUncheckedCreateWithoutTenantInput>
  }

  export type TenantActivityLogUpdateWithWhereUniqueWithoutTenantInput = {
    where: TenantActivityLogWhereUniqueInput
    data: XOR<TenantActivityLogUpdateWithoutTenantInput, TenantActivityLogUncheckedUpdateWithoutTenantInput>
  }

  export type TenantActivityLogUpdateManyWithWhereWithoutTenantInput = {
    where: TenantActivityLogScalarWhereInput
    data: XOR<TenantActivityLogUpdateManyMutationInput, TenantActivityLogUncheckedUpdateManyWithoutTenantInput>
  }

  export type TenantActivityLogScalarWhereInput = {
    AND?: TenantActivityLogScalarWhereInput | TenantActivityLogScalarWhereInput[]
    OR?: TenantActivityLogScalarWhereInput[]
    NOT?: TenantActivityLogScalarWhereInput | TenantActivityLogScalarWhereInput[]
    id?: StringFilter<"TenantActivityLog"> | string
    tenantId?: StringFilter<"TenantActivityLog"> | string
    action?: StringFilter<"TenantActivityLog"> | string
    performedBy?: StringNullableFilter<"TenantActivityLog"> | string | null
    details?: JsonNullableFilter<"TenantActivityLog">
    ipAddress?: StringNullableFilter<"TenantActivityLog"> | string | null
    createdAt?: DateTimeFilter<"TenantActivityLog"> | Date | string
  }

  export type TenantMetricsUpsertWithWhereUniqueWithoutTenantInput = {
    where: TenantMetricsWhereUniqueInput
    update: XOR<TenantMetricsUpdateWithoutTenantInput, TenantMetricsUncheckedUpdateWithoutTenantInput>
    create: XOR<TenantMetricsCreateWithoutTenantInput, TenantMetricsUncheckedCreateWithoutTenantInput>
  }

  export type TenantMetricsUpdateWithWhereUniqueWithoutTenantInput = {
    where: TenantMetricsWhereUniqueInput
    data: XOR<TenantMetricsUpdateWithoutTenantInput, TenantMetricsUncheckedUpdateWithoutTenantInput>
  }

  export type TenantMetricsUpdateManyWithWhereWithoutTenantInput = {
    where: TenantMetricsScalarWhereInput
    data: XOR<TenantMetricsUpdateManyMutationInput, TenantMetricsUncheckedUpdateManyWithoutTenantInput>
  }

  export type TenantMetricsScalarWhereInput = {
    AND?: TenantMetricsScalarWhereInput | TenantMetricsScalarWhereInput[]
    OR?: TenantMetricsScalarWhereInput[]
    NOT?: TenantMetricsScalarWhereInput | TenantMetricsScalarWhereInput[]
    id?: StringFilter<"TenantMetrics"> | string
    tenantId?: StringFilter<"TenantMetrics"> | string
    date?: DateTimeFilter<"TenantMetrics"> | Date | string
    totalRevenue?: FloatFilter<"TenantMetrics"> | number
    totalOrders?: IntFilter<"TenantMetrics"> | number
    activeUsers?: IntFilter<"TenantMetrics"> | number
    activeLocations?: IntFilter<"TenantMetrics"> | number
    createdAt?: DateTimeFilter<"TenantMetrics"> | Date | string
  }

  export type TenantUsageUpsertWithWhereUniqueWithoutTenantInput = {
    where: TenantUsageWhereUniqueInput
    update: XOR<TenantUsageUpdateWithoutTenantInput, TenantUsageUncheckedUpdateWithoutTenantInput>
    create: XOR<TenantUsageCreateWithoutTenantInput, TenantUsageUncheckedCreateWithoutTenantInput>
  }

  export type TenantUsageUpdateWithWhereUniqueWithoutTenantInput = {
    where: TenantUsageWhereUniqueInput
    data: XOR<TenantUsageUpdateWithoutTenantInput, TenantUsageUncheckedUpdateWithoutTenantInput>
  }

  export type TenantUsageUpdateManyWithWhereWithoutTenantInput = {
    where: TenantUsageScalarWhereInput
    data: XOR<TenantUsageUpdateManyMutationInput, TenantUsageUncheckedUpdateManyWithoutTenantInput>
  }

  export type TenantUsageScalarWhereInput = {
    AND?: TenantUsageScalarWhereInput | TenantUsageScalarWhereInput[]
    OR?: TenantUsageScalarWhereInput[]
    NOT?: TenantUsageScalarWhereInput | TenantUsageScalarWhereInput[]
    id?: StringFilter<"TenantUsage"> | string
    tenantId?: StringFilter<"TenantUsage"> | string
    date?: DateTimeFilter<"TenantUsage"> | Date | string
    dbSizeMB?: FloatFilter<"TenantUsage"> | number
    dbSizeBytes?: BigIntFilter<"TenantUsage"> | bigint | number
    apiRequests?: IntFilter<"TenantUsage"> | number
    apiRequestsByEndpoint?: JsonNullableFilter<"TenantUsage">
    storageSizeMB?: FloatFilter<"TenantUsage"> | number
    dbOverage?: BoolFilter<"TenantUsage"> | boolean
    apiOverage?: BoolFilter<"TenantUsage"> | boolean
    overageAmount?: FloatNullableFilter<"TenantUsage"> | number | null
    recordedAt?: DateTimeFilter<"TenantUsage"> | Date | string
    createdAt?: DateTimeFilter<"TenantUsage"> | Date | string
  }

  export type UsageAlertUpsertWithWhereUniqueWithoutTenantInput = {
    where: UsageAlertWhereUniqueInput
    update: XOR<UsageAlertUpdateWithoutTenantInput, UsageAlertUncheckedUpdateWithoutTenantInput>
    create: XOR<UsageAlertCreateWithoutTenantInput, UsageAlertUncheckedCreateWithoutTenantInput>
  }

  export type UsageAlertUpdateWithWhereUniqueWithoutTenantInput = {
    where: UsageAlertWhereUniqueInput
    data: XOR<UsageAlertUpdateWithoutTenantInput, UsageAlertUncheckedUpdateWithoutTenantInput>
  }

  export type UsageAlertUpdateManyWithWhereWithoutTenantInput = {
    where: UsageAlertScalarWhereInput
    data: XOR<UsageAlertUpdateManyMutationInput, UsageAlertUncheckedUpdateManyWithoutTenantInput>
  }

  export type UsageAlertScalarWhereInput = {
    AND?: UsageAlertScalarWhereInput | UsageAlertScalarWhereInput[]
    OR?: UsageAlertScalarWhereInput[]
    NOT?: UsageAlertScalarWhereInput | UsageAlertScalarWhereInput[]
    id?: StringFilter<"UsageAlert"> | string
    tenantId?: StringFilter<"UsageAlert"> | string
    resource?: StringFilter<"UsageAlert"> | string
    level?: StringFilter<"UsageAlert"> | string
    percentage?: IntFilter<"UsageAlert"> | number
    current?: FloatFilter<"UsageAlert"> | number
    limit?: FloatFilter<"UsageAlert"> | number
    message?: StringFilter<"UsageAlert"> | string
    isRead?: BoolFilter<"UsageAlert"> | boolean
    isSent?: BoolFilter<"UsageAlert"> | boolean
    sentAt?: DateTimeNullableFilter<"UsageAlert"> | Date | string | null
    createdAt?: DateTimeFilter<"UsageAlert"> | Date | string
    resolvedAt?: DateTimeNullableFilter<"UsageAlert"> | Date | string | null
  }

  export type TenantCreateWithoutPaymentRecordsInput = {
    id?: string
    slug: string
    businessName: string
    contactName: string
    contactEmail: string
    contactPhone?: string | null
    databaseUrl: string
    databaseHost: string
    databaseName: string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: $Enums.SubscriptionStatus
    trialEndsAt?: Date | string | null
    billingCycleStart?: Date | string | null
    billingCycleEnd?: Date | string | null
    monthlyFee?: number
    lastPaymentDate?: Date | string | null
    lastPaymentAmount?: number | null
    nextPaymentDue?: Date | string | null
    paymentNotes?: string | null
    customStorageLimitMB?: number | null
    customBandwidthLimitGB?: number | null
    customOrdersLimit?: number | null
    customStaffLimit?: number | null
    hasPrioritySupport?: boolean
    currentStorageUsageMB?: number
    currentBandwidthGB?: number
    currentMonthOrders?: number
    currentStaffCount?: number
    lastBillingCalculation?: Date | string | null
    lastMonthOverageCharges?: number
    lastMonthTotalBill?: number
    status?: $Enums.TenantStatus
    isActive?: boolean
    maxLocations?: number
    maxUsers?: number
    maxDbSizeMB?: number
    maxApiRequests?: number
    maxStorageMB?: number
    currentDbSizeMB?: number
    currentStorageMB?: number
    dbLimitExceeded?: boolean
    apiLimitExceeded?: boolean
    limitExceededAt?: Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activatedAt?: Date | string | null
    suspendedAt?: Date | string | null
    activityLogs?: TenantActivityLogCreateNestedManyWithoutTenantInput
    metrics?: TenantMetricsCreateNestedManyWithoutTenantInput
    usageHistory?: TenantUsageCreateNestedManyWithoutTenantInput
    usageAlerts?: UsageAlertCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutPaymentRecordsInput = {
    id?: string
    slug: string
    businessName: string
    contactName: string
    contactEmail: string
    contactPhone?: string | null
    databaseUrl: string
    databaseHost: string
    databaseName: string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: $Enums.SubscriptionStatus
    trialEndsAt?: Date | string | null
    billingCycleStart?: Date | string | null
    billingCycleEnd?: Date | string | null
    monthlyFee?: number
    lastPaymentDate?: Date | string | null
    lastPaymentAmount?: number | null
    nextPaymentDue?: Date | string | null
    paymentNotes?: string | null
    customStorageLimitMB?: number | null
    customBandwidthLimitGB?: number | null
    customOrdersLimit?: number | null
    customStaffLimit?: number | null
    hasPrioritySupport?: boolean
    currentStorageUsageMB?: number
    currentBandwidthGB?: number
    currentMonthOrders?: number
    currentStaffCount?: number
    lastBillingCalculation?: Date | string | null
    lastMonthOverageCharges?: number
    lastMonthTotalBill?: number
    status?: $Enums.TenantStatus
    isActive?: boolean
    maxLocations?: number
    maxUsers?: number
    maxDbSizeMB?: number
    maxApiRequests?: number
    maxStorageMB?: number
    currentDbSizeMB?: number
    currentStorageMB?: number
    dbLimitExceeded?: boolean
    apiLimitExceeded?: boolean
    limitExceededAt?: Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activatedAt?: Date | string | null
    suspendedAt?: Date | string | null
    activityLogs?: TenantActivityLogUncheckedCreateNestedManyWithoutTenantInput
    metrics?: TenantMetricsUncheckedCreateNestedManyWithoutTenantInput
    usageHistory?: TenantUsageUncheckedCreateNestedManyWithoutTenantInput
    usageAlerts?: UsageAlertUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutPaymentRecordsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutPaymentRecordsInput, TenantUncheckedCreateWithoutPaymentRecordsInput>
  }

  export type TenantUpsertWithoutPaymentRecordsInput = {
    update: XOR<TenantUpdateWithoutPaymentRecordsInput, TenantUncheckedUpdateWithoutPaymentRecordsInput>
    create: XOR<TenantCreateWithoutPaymentRecordsInput, TenantUncheckedCreateWithoutPaymentRecordsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutPaymentRecordsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutPaymentRecordsInput, TenantUncheckedUpdateWithoutPaymentRecordsInput>
  }

  export type TenantUpdateWithoutPaymentRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseUrl?: StringFieldUpdateOperationsInput | string
    databaseHost?: StringFieldUpdateOperationsInput | string
    databaseName?: StringFieldUpdateOperationsInput | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFee?: FloatFieldUpdateOperationsInput | number
    lastPaymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    nextPaymentDue?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentNotes?: NullableStringFieldUpdateOperationsInput | string | null
    customStorageLimitMB?: NullableIntFieldUpdateOperationsInput | number | null
    customBandwidthLimitGB?: NullableIntFieldUpdateOperationsInput | number | null
    customOrdersLimit?: NullableIntFieldUpdateOperationsInput | number | null
    customStaffLimit?: NullableIntFieldUpdateOperationsInput | number | null
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    currentStorageUsageMB?: FloatFieldUpdateOperationsInput | number
    currentBandwidthGB?: FloatFieldUpdateOperationsInput | number
    currentMonthOrders?: IntFieldUpdateOperationsInput | number
    currentStaffCount?: IntFieldUpdateOperationsInput | number
    lastBillingCalculation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMonthOverageCharges?: FloatFieldUpdateOperationsInput | number
    lastMonthTotalBill?: FloatFieldUpdateOperationsInput | number
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    maxLocations?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxDbSizeMB?: IntFieldUpdateOperationsInput | number
    maxApiRequests?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    currentDbSizeMB?: FloatFieldUpdateOperationsInput | number
    currentStorageMB?: FloatFieldUpdateOperationsInput | number
    dbLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    apiLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    limitExceededAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activityLogs?: TenantActivityLogUpdateManyWithoutTenantNestedInput
    metrics?: TenantMetricsUpdateManyWithoutTenantNestedInput
    usageHistory?: TenantUsageUpdateManyWithoutTenantNestedInput
    usageAlerts?: UsageAlertUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutPaymentRecordsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseUrl?: StringFieldUpdateOperationsInput | string
    databaseHost?: StringFieldUpdateOperationsInput | string
    databaseName?: StringFieldUpdateOperationsInput | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFee?: FloatFieldUpdateOperationsInput | number
    lastPaymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    nextPaymentDue?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentNotes?: NullableStringFieldUpdateOperationsInput | string | null
    customStorageLimitMB?: NullableIntFieldUpdateOperationsInput | number | null
    customBandwidthLimitGB?: NullableIntFieldUpdateOperationsInput | number | null
    customOrdersLimit?: NullableIntFieldUpdateOperationsInput | number | null
    customStaffLimit?: NullableIntFieldUpdateOperationsInput | number | null
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    currentStorageUsageMB?: FloatFieldUpdateOperationsInput | number
    currentBandwidthGB?: FloatFieldUpdateOperationsInput | number
    currentMonthOrders?: IntFieldUpdateOperationsInput | number
    currentStaffCount?: IntFieldUpdateOperationsInput | number
    lastBillingCalculation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMonthOverageCharges?: FloatFieldUpdateOperationsInput | number
    lastMonthTotalBill?: FloatFieldUpdateOperationsInput | number
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    maxLocations?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxDbSizeMB?: IntFieldUpdateOperationsInput | number
    maxApiRequests?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    currentDbSizeMB?: FloatFieldUpdateOperationsInput | number
    currentStorageMB?: FloatFieldUpdateOperationsInput | number
    dbLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    apiLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    limitExceededAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    activityLogs?: TenantActivityLogUncheckedUpdateManyWithoutTenantNestedInput
    metrics?: TenantMetricsUncheckedUpdateManyWithoutTenantNestedInput
    usageHistory?: TenantUsageUncheckedUpdateManyWithoutTenantNestedInput
    usageAlerts?: UsageAlertUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantActivityLogCreateWithoutSuperAdminInput = {
    id?: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
    tenant: TenantCreateNestedOneWithoutActivityLogsInput
  }

  export type TenantActivityLogUncheckedCreateWithoutSuperAdminInput = {
    id?: string
    tenantId: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type TenantActivityLogCreateOrConnectWithoutSuperAdminInput = {
    where: TenantActivityLogWhereUniqueInput
    create: XOR<TenantActivityLogCreateWithoutSuperAdminInput, TenantActivityLogUncheckedCreateWithoutSuperAdminInput>
  }

  export type TenantActivityLogCreateManySuperAdminInputEnvelope = {
    data: TenantActivityLogCreateManySuperAdminInput | TenantActivityLogCreateManySuperAdminInput[]
    skipDuplicates?: boolean
  }

  export type TenantActivityLogUpsertWithWhereUniqueWithoutSuperAdminInput = {
    where: TenantActivityLogWhereUniqueInput
    update: XOR<TenantActivityLogUpdateWithoutSuperAdminInput, TenantActivityLogUncheckedUpdateWithoutSuperAdminInput>
    create: XOR<TenantActivityLogCreateWithoutSuperAdminInput, TenantActivityLogUncheckedCreateWithoutSuperAdminInput>
  }

  export type TenantActivityLogUpdateWithWhereUniqueWithoutSuperAdminInput = {
    where: TenantActivityLogWhereUniqueInput
    data: XOR<TenantActivityLogUpdateWithoutSuperAdminInput, TenantActivityLogUncheckedUpdateWithoutSuperAdminInput>
  }

  export type TenantActivityLogUpdateManyWithWhereWithoutSuperAdminInput = {
    where: TenantActivityLogScalarWhereInput
    data: XOR<TenantActivityLogUpdateManyMutationInput, TenantActivityLogUncheckedUpdateManyWithoutSuperAdminInput>
  }

  export type TenantCreateWithoutActivityLogsInput = {
    id?: string
    slug: string
    businessName: string
    contactName: string
    contactEmail: string
    contactPhone?: string | null
    databaseUrl: string
    databaseHost: string
    databaseName: string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: $Enums.SubscriptionStatus
    trialEndsAt?: Date | string | null
    billingCycleStart?: Date | string | null
    billingCycleEnd?: Date | string | null
    monthlyFee?: number
    lastPaymentDate?: Date | string | null
    lastPaymentAmount?: number | null
    nextPaymentDue?: Date | string | null
    paymentNotes?: string | null
    customStorageLimitMB?: number | null
    customBandwidthLimitGB?: number | null
    customOrdersLimit?: number | null
    customStaffLimit?: number | null
    hasPrioritySupport?: boolean
    currentStorageUsageMB?: number
    currentBandwidthGB?: number
    currentMonthOrders?: number
    currentStaffCount?: number
    lastBillingCalculation?: Date | string | null
    lastMonthOverageCharges?: number
    lastMonthTotalBill?: number
    status?: $Enums.TenantStatus
    isActive?: boolean
    maxLocations?: number
    maxUsers?: number
    maxDbSizeMB?: number
    maxApiRequests?: number
    maxStorageMB?: number
    currentDbSizeMB?: number
    currentStorageMB?: number
    dbLimitExceeded?: boolean
    apiLimitExceeded?: boolean
    limitExceededAt?: Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activatedAt?: Date | string | null
    suspendedAt?: Date | string | null
    paymentRecords?: PaymentRecordCreateNestedManyWithoutTenantInput
    metrics?: TenantMetricsCreateNestedManyWithoutTenantInput
    usageHistory?: TenantUsageCreateNestedManyWithoutTenantInput
    usageAlerts?: UsageAlertCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutActivityLogsInput = {
    id?: string
    slug: string
    businessName: string
    contactName: string
    contactEmail: string
    contactPhone?: string | null
    databaseUrl: string
    databaseHost: string
    databaseName: string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: $Enums.SubscriptionStatus
    trialEndsAt?: Date | string | null
    billingCycleStart?: Date | string | null
    billingCycleEnd?: Date | string | null
    monthlyFee?: number
    lastPaymentDate?: Date | string | null
    lastPaymentAmount?: number | null
    nextPaymentDue?: Date | string | null
    paymentNotes?: string | null
    customStorageLimitMB?: number | null
    customBandwidthLimitGB?: number | null
    customOrdersLimit?: number | null
    customStaffLimit?: number | null
    hasPrioritySupport?: boolean
    currentStorageUsageMB?: number
    currentBandwidthGB?: number
    currentMonthOrders?: number
    currentStaffCount?: number
    lastBillingCalculation?: Date | string | null
    lastMonthOverageCharges?: number
    lastMonthTotalBill?: number
    status?: $Enums.TenantStatus
    isActive?: boolean
    maxLocations?: number
    maxUsers?: number
    maxDbSizeMB?: number
    maxApiRequests?: number
    maxStorageMB?: number
    currentDbSizeMB?: number
    currentStorageMB?: number
    dbLimitExceeded?: boolean
    apiLimitExceeded?: boolean
    limitExceededAt?: Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activatedAt?: Date | string | null
    suspendedAt?: Date | string | null
    paymentRecords?: PaymentRecordUncheckedCreateNestedManyWithoutTenantInput
    metrics?: TenantMetricsUncheckedCreateNestedManyWithoutTenantInput
    usageHistory?: TenantUsageUncheckedCreateNestedManyWithoutTenantInput
    usageAlerts?: UsageAlertUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutActivityLogsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutActivityLogsInput, TenantUncheckedCreateWithoutActivityLogsInput>
  }

  export type SuperAdminCreateWithoutActivityLogsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.SuperAdminRole
    isActive?: boolean
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    lastFailedLogin?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
  }

  export type SuperAdminUncheckedCreateWithoutActivityLogsInput = {
    id?: string
    name: string
    email: string
    password: string
    role?: $Enums.SuperAdminRole
    isActive?: boolean
    failedLoginAttempts?: number
    lockedUntil?: Date | string | null
    lastFailedLogin?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    lastLoginAt?: Date | string | null
  }

  export type SuperAdminCreateOrConnectWithoutActivityLogsInput = {
    where: SuperAdminWhereUniqueInput
    create: XOR<SuperAdminCreateWithoutActivityLogsInput, SuperAdminUncheckedCreateWithoutActivityLogsInput>
  }

  export type TenantUpsertWithoutActivityLogsInput = {
    update: XOR<TenantUpdateWithoutActivityLogsInput, TenantUncheckedUpdateWithoutActivityLogsInput>
    create: XOR<TenantCreateWithoutActivityLogsInput, TenantUncheckedCreateWithoutActivityLogsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutActivityLogsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutActivityLogsInput, TenantUncheckedUpdateWithoutActivityLogsInput>
  }

  export type TenantUpdateWithoutActivityLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseUrl?: StringFieldUpdateOperationsInput | string
    databaseHost?: StringFieldUpdateOperationsInput | string
    databaseName?: StringFieldUpdateOperationsInput | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFee?: FloatFieldUpdateOperationsInput | number
    lastPaymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    nextPaymentDue?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentNotes?: NullableStringFieldUpdateOperationsInput | string | null
    customStorageLimitMB?: NullableIntFieldUpdateOperationsInput | number | null
    customBandwidthLimitGB?: NullableIntFieldUpdateOperationsInput | number | null
    customOrdersLimit?: NullableIntFieldUpdateOperationsInput | number | null
    customStaffLimit?: NullableIntFieldUpdateOperationsInput | number | null
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    currentStorageUsageMB?: FloatFieldUpdateOperationsInput | number
    currentBandwidthGB?: FloatFieldUpdateOperationsInput | number
    currentMonthOrders?: IntFieldUpdateOperationsInput | number
    currentStaffCount?: IntFieldUpdateOperationsInput | number
    lastBillingCalculation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMonthOverageCharges?: FloatFieldUpdateOperationsInput | number
    lastMonthTotalBill?: FloatFieldUpdateOperationsInput | number
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    maxLocations?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxDbSizeMB?: IntFieldUpdateOperationsInput | number
    maxApiRequests?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    currentDbSizeMB?: FloatFieldUpdateOperationsInput | number
    currentStorageMB?: FloatFieldUpdateOperationsInput | number
    dbLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    apiLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    limitExceededAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentRecords?: PaymentRecordUpdateManyWithoutTenantNestedInput
    metrics?: TenantMetricsUpdateManyWithoutTenantNestedInput
    usageHistory?: TenantUsageUpdateManyWithoutTenantNestedInput
    usageAlerts?: UsageAlertUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutActivityLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseUrl?: StringFieldUpdateOperationsInput | string
    databaseHost?: StringFieldUpdateOperationsInput | string
    databaseName?: StringFieldUpdateOperationsInput | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFee?: FloatFieldUpdateOperationsInput | number
    lastPaymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    nextPaymentDue?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentNotes?: NullableStringFieldUpdateOperationsInput | string | null
    customStorageLimitMB?: NullableIntFieldUpdateOperationsInput | number | null
    customBandwidthLimitGB?: NullableIntFieldUpdateOperationsInput | number | null
    customOrdersLimit?: NullableIntFieldUpdateOperationsInput | number | null
    customStaffLimit?: NullableIntFieldUpdateOperationsInput | number | null
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    currentStorageUsageMB?: FloatFieldUpdateOperationsInput | number
    currentBandwidthGB?: FloatFieldUpdateOperationsInput | number
    currentMonthOrders?: IntFieldUpdateOperationsInput | number
    currentStaffCount?: IntFieldUpdateOperationsInput | number
    lastBillingCalculation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMonthOverageCharges?: FloatFieldUpdateOperationsInput | number
    lastMonthTotalBill?: FloatFieldUpdateOperationsInput | number
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    maxLocations?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxDbSizeMB?: IntFieldUpdateOperationsInput | number
    maxApiRequests?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    currentDbSizeMB?: FloatFieldUpdateOperationsInput | number
    currentStorageMB?: FloatFieldUpdateOperationsInput | number
    dbLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    apiLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    limitExceededAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentRecords?: PaymentRecordUncheckedUpdateManyWithoutTenantNestedInput
    metrics?: TenantMetricsUncheckedUpdateManyWithoutTenantNestedInput
    usageHistory?: TenantUsageUncheckedUpdateManyWithoutTenantNestedInput
    usageAlerts?: UsageAlertUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type SuperAdminUpsertWithoutActivityLogsInput = {
    update: XOR<SuperAdminUpdateWithoutActivityLogsInput, SuperAdminUncheckedUpdateWithoutActivityLogsInput>
    create: XOR<SuperAdminCreateWithoutActivityLogsInput, SuperAdminUncheckedCreateWithoutActivityLogsInput>
    where?: SuperAdminWhereInput
  }

  export type SuperAdminUpdateToOneWithWhereWithoutActivityLogsInput = {
    where?: SuperAdminWhereInput
    data: XOR<SuperAdminUpdateWithoutActivityLogsInput, SuperAdminUncheckedUpdateWithoutActivityLogsInput>
  }

  export type SuperAdminUpdateWithoutActivityLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumSuperAdminRoleFieldUpdateOperationsInput | $Enums.SuperAdminRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFailedLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type SuperAdminUncheckedUpdateWithoutActivityLogsInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    password?: StringFieldUpdateOperationsInput | string
    role?: EnumSuperAdminRoleFieldUpdateOperationsInput | $Enums.SuperAdminRole
    isActive?: BoolFieldUpdateOperationsInput | boolean
    failedLoginAttempts?: IntFieldUpdateOperationsInput | number
    lockedUntil?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastFailedLogin?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lastLoginAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantCreateWithoutMetricsInput = {
    id?: string
    slug: string
    businessName: string
    contactName: string
    contactEmail: string
    contactPhone?: string | null
    databaseUrl: string
    databaseHost: string
    databaseName: string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: $Enums.SubscriptionStatus
    trialEndsAt?: Date | string | null
    billingCycleStart?: Date | string | null
    billingCycleEnd?: Date | string | null
    monthlyFee?: number
    lastPaymentDate?: Date | string | null
    lastPaymentAmount?: number | null
    nextPaymentDue?: Date | string | null
    paymentNotes?: string | null
    customStorageLimitMB?: number | null
    customBandwidthLimitGB?: number | null
    customOrdersLimit?: number | null
    customStaffLimit?: number | null
    hasPrioritySupport?: boolean
    currentStorageUsageMB?: number
    currentBandwidthGB?: number
    currentMonthOrders?: number
    currentStaffCount?: number
    lastBillingCalculation?: Date | string | null
    lastMonthOverageCharges?: number
    lastMonthTotalBill?: number
    status?: $Enums.TenantStatus
    isActive?: boolean
    maxLocations?: number
    maxUsers?: number
    maxDbSizeMB?: number
    maxApiRequests?: number
    maxStorageMB?: number
    currentDbSizeMB?: number
    currentStorageMB?: number
    dbLimitExceeded?: boolean
    apiLimitExceeded?: boolean
    limitExceededAt?: Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activatedAt?: Date | string | null
    suspendedAt?: Date | string | null
    paymentRecords?: PaymentRecordCreateNestedManyWithoutTenantInput
    activityLogs?: TenantActivityLogCreateNestedManyWithoutTenantInput
    usageHistory?: TenantUsageCreateNestedManyWithoutTenantInput
    usageAlerts?: UsageAlertCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutMetricsInput = {
    id?: string
    slug: string
    businessName: string
    contactName: string
    contactEmail: string
    contactPhone?: string | null
    databaseUrl: string
    databaseHost: string
    databaseName: string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: $Enums.SubscriptionStatus
    trialEndsAt?: Date | string | null
    billingCycleStart?: Date | string | null
    billingCycleEnd?: Date | string | null
    monthlyFee?: number
    lastPaymentDate?: Date | string | null
    lastPaymentAmount?: number | null
    nextPaymentDue?: Date | string | null
    paymentNotes?: string | null
    customStorageLimitMB?: number | null
    customBandwidthLimitGB?: number | null
    customOrdersLimit?: number | null
    customStaffLimit?: number | null
    hasPrioritySupport?: boolean
    currentStorageUsageMB?: number
    currentBandwidthGB?: number
    currentMonthOrders?: number
    currentStaffCount?: number
    lastBillingCalculation?: Date | string | null
    lastMonthOverageCharges?: number
    lastMonthTotalBill?: number
    status?: $Enums.TenantStatus
    isActive?: boolean
    maxLocations?: number
    maxUsers?: number
    maxDbSizeMB?: number
    maxApiRequests?: number
    maxStorageMB?: number
    currentDbSizeMB?: number
    currentStorageMB?: number
    dbLimitExceeded?: boolean
    apiLimitExceeded?: boolean
    limitExceededAt?: Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activatedAt?: Date | string | null
    suspendedAt?: Date | string | null
    paymentRecords?: PaymentRecordUncheckedCreateNestedManyWithoutTenantInput
    activityLogs?: TenantActivityLogUncheckedCreateNestedManyWithoutTenantInput
    usageHistory?: TenantUsageUncheckedCreateNestedManyWithoutTenantInput
    usageAlerts?: UsageAlertUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutMetricsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutMetricsInput, TenantUncheckedCreateWithoutMetricsInput>
  }

  export type TenantUpsertWithoutMetricsInput = {
    update: XOR<TenantUpdateWithoutMetricsInput, TenantUncheckedUpdateWithoutMetricsInput>
    create: XOR<TenantCreateWithoutMetricsInput, TenantUncheckedCreateWithoutMetricsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutMetricsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutMetricsInput, TenantUncheckedUpdateWithoutMetricsInput>
  }

  export type TenantUpdateWithoutMetricsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseUrl?: StringFieldUpdateOperationsInput | string
    databaseHost?: StringFieldUpdateOperationsInput | string
    databaseName?: StringFieldUpdateOperationsInput | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFee?: FloatFieldUpdateOperationsInput | number
    lastPaymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    nextPaymentDue?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentNotes?: NullableStringFieldUpdateOperationsInput | string | null
    customStorageLimitMB?: NullableIntFieldUpdateOperationsInput | number | null
    customBandwidthLimitGB?: NullableIntFieldUpdateOperationsInput | number | null
    customOrdersLimit?: NullableIntFieldUpdateOperationsInput | number | null
    customStaffLimit?: NullableIntFieldUpdateOperationsInput | number | null
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    currentStorageUsageMB?: FloatFieldUpdateOperationsInput | number
    currentBandwidthGB?: FloatFieldUpdateOperationsInput | number
    currentMonthOrders?: IntFieldUpdateOperationsInput | number
    currentStaffCount?: IntFieldUpdateOperationsInput | number
    lastBillingCalculation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMonthOverageCharges?: FloatFieldUpdateOperationsInput | number
    lastMonthTotalBill?: FloatFieldUpdateOperationsInput | number
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    maxLocations?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxDbSizeMB?: IntFieldUpdateOperationsInput | number
    maxApiRequests?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    currentDbSizeMB?: FloatFieldUpdateOperationsInput | number
    currentStorageMB?: FloatFieldUpdateOperationsInput | number
    dbLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    apiLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    limitExceededAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentRecords?: PaymentRecordUpdateManyWithoutTenantNestedInput
    activityLogs?: TenantActivityLogUpdateManyWithoutTenantNestedInput
    usageHistory?: TenantUsageUpdateManyWithoutTenantNestedInput
    usageAlerts?: UsageAlertUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutMetricsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseUrl?: StringFieldUpdateOperationsInput | string
    databaseHost?: StringFieldUpdateOperationsInput | string
    databaseName?: StringFieldUpdateOperationsInput | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFee?: FloatFieldUpdateOperationsInput | number
    lastPaymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    nextPaymentDue?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentNotes?: NullableStringFieldUpdateOperationsInput | string | null
    customStorageLimitMB?: NullableIntFieldUpdateOperationsInput | number | null
    customBandwidthLimitGB?: NullableIntFieldUpdateOperationsInput | number | null
    customOrdersLimit?: NullableIntFieldUpdateOperationsInput | number | null
    customStaffLimit?: NullableIntFieldUpdateOperationsInput | number | null
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    currentStorageUsageMB?: FloatFieldUpdateOperationsInput | number
    currentBandwidthGB?: FloatFieldUpdateOperationsInput | number
    currentMonthOrders?: IntFieldUpdateOperationsInput | number
    currentStaffCount?: IntFieldUpdateOperationsInput | number
    lastBillingCalculation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMonthOverageCharges?: FloatFieldUpdateOperationsInput | number
    lastMonthTotalBill?: FloatFieldUpdateOperationsInput | number
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    maxLocations?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxDbSizeMB?: IntFieldUpdateOperationsInput | number
    maxApiRequests?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    currentDbSizeMB?: FloatFieldUpdateOperationsInput | number
    currentStorageMB?: FloatFieldUpdateOperationsInput | number
    dbLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    apiLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    limitExceededAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentRecords?: PaymentRecordUncheckedUpdateManyWithoutTenantNestedInput
    activityLogs?: TenantActivityLogUncheckedUpdateManyWithoutTenantNestedInput
    usageHistory?: TenantUsageUncheckedUpdateManyWithoutTenantNestedInput
    usageAlerts?: UsageAlertUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutUsageHistoryInput = {
    id?: string
    slug: string
    businessName: string
    contactName: string
    contactEmail: string
    contactPhone?: string | null
    databaseUrl: string
    databaseHost: string
    databaseName: string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: $Enums.SubscriptionStatus
    trialEndsAt?: Date | string | null
    billingCycleStart?: Date | string | null
    billingCycleEnd?: Date | string | null
    monthlyFee?: number
    lastPaymentDate?: Date | string | null
    lastPaymentAmount?: number | null
    nextPaymentDue?: Date | string | null
    paymentNotes?: string | null
    customStorageLimitMB?: number | null
    customBandwidthLimitGB?: number | null
    customOrdersLimit?: number | null
    customStaffLimit?: number | null
    hasPrioritySupport?: boolean
    currentStorageUsageMB?: number
    currentBandwidthGB?: number
    currentMonthOrders?: number
    currentStaffCount?: number
    lastBillingCalculation?: Date | string | null
    lastMonthOverageCharges?: number
    lastMonthTotalBill?: number
    status?: $Enums.TenantStatus
    isActive?: boolean
    maxLocations?: number
    maxUsers?: number
    maxDbSizeMB?: number
    maxApiRequests?: number
    maxStorageMB?: number
    currentDbSizeMB?: number
    currentStorageMB?: number
    dbLimitExceeded?: boolean
    apiLimitExceeded?: boolean
    limitExceededAt?: Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activatedAt?: Date | string | null
    suspendedAt?: Date | string | null
    paymentRecords?: PaymentRecordCreateNestedManyWithoutTenantInput
    activityLogs?: TenantActivityLogCreateNestedManyWithoutTenantInput
    metrics?: TenantMetricsCreateNestedManyWithoutTenantInput
    usageAlerts?: UsageAlertCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutUsageHistoryInput = {
    id?: string
    slug: string
    businessName: string
    contactName: string
    contactEmail: string
    contactPhone?: string | null
    databaseUrl: string
    databaseHost: string
    databaseName: string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: $Enums.SubscriptionStatus
    trialEndsAt?: Date | string | null
    billingCycleStart?: Date | string | null
    billingCycleEnd?: Date | string | null
    monthlyFee?: number
    lastPaymentDate?: Date | string | null
    lastPaymentAmount?: number | null
    nextPaymentDue?: Date | string | null
    paymentNotes?: string | null
    customStorageLimitMB?: number | null
    customBandwidthLimitGB?: number | null
    customOrdersLimit?: number | null
    customStaffLimit?: number | null
    hasPrioritySupport?: boolean
    currentStorageUsageMB?: number
    currentBandwidthGB?: number
    currentMonthOrders?: number
    currentStaffCount?: number
    lastBillingCalculation?: Date | string | null
    lastMonthOverageCharges?: number
    lastMonthTotalBill?: number
    status?: $Enums.TenantStatus
    isActive?: boolean
    maxLocations?: number
    maxUsers?: number
    maxDbSizeMB?: number
    maxApiRequests?: number
    maxStorageMB?: number
    currentDbSizeMB?: number
    currentStorageMB?: number
    dbLimitExceeded?: boolean
    apiLimitExceeded?: boolean
    limitExceededAt?: Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activatedAt?: Date | string | null
    suspendedAt?: Date | string | null
    paymentRecords?: PaymentRecordUncheckedCreateNestedManyWithoutTenantInput
    activityLogs?: TenantActivityLogUncheckedCreateNestedManyWithoutTenantInput
    metrics?: TenantMetricsUncheckedCreateNestedManyWithoutTenantInput
    usageAlerts?: UsageAlertUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutUsageHistoryInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutUsageHistoryInput, TenantUncheckedCreateWithoutUsageHistoryInput>
  }

  export type TenantUpsertWithoutUsageHistoryInput = {
    update: XOR<TenantUpdateWithoutUsageHistoryInput, TenantUncheckedUpdateWithoutUsageHistoryInput>
    create: XOR<TenantCreateWithoutUsageHistoryInput, TenantUncheckedCreateWithoutUsageHistoryInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutUsageHistoryInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutUsageHistoryInput, TenantUncheckedUpdateWithoutUsageHistoryInput>
  }

  export type TenantUpdateWithoutUsageHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseUrl?: StringFieldUpdateOperationsInput | string
    databaseHost?: StringFieldUpdateOperationsInput | string
    databaseName?: StringFieldUpdateOperationsInput | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFee?: FloatFieldUpdateOperationsInput | number
    lastPaymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    nextPaymentDue?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentNotes?: NullableStringFieldUpdateOperationsInput | string | null
    customStorageLimitMB?: NullableIntFieldUpdateOperationsInput | number | null
    customBandwidthLimitGB?: NullableIntFieldUpdateOperationsInput | number | null
    customOrdersLimit?: NullableIntFieldUpdateOperationsInput | number | null
    customStaffLimit?: NullableIntFieldUpdateOperationsInput | number | null
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    currentStorageUsageMB?: FloatFieldUpdateOperationsInput | number
    currentBandwidthGB?: FloatFieldUpdateOperationsInput | number
    currentMonthOrders?: IntFieldUpdateOperationsInput | number
    currentStaffCount?: IntFieldUpdateOperationsInput | number
    lastBillingCalculation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMonthOverageCharges?: FloatFieldUpdateOperationsInput | number
    lastMonthTotalBill?: FloatFieldUpdateOperationsInput | number
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    maxLocations?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxDbSizeMB?: IntFieldUpdateOperationsInput | number
    maxApiRequests?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    currentDbSizeMB?: FloatFieldUpdateOperationsInput | number
    currentStorageMB?: FloatFieldUpdateOperationsInput | number
    dbLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    apiLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    limitExceededAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentRecords?: PaymentRecordUpdateManyWithoutTenantNestedInput
    activityLogs?: TenantActivityLogUpdateManyWithoutTenantNestedInput
    metrics?: TenantMetricsUpdateManyWithoutTenantNestedInput
    usageAlerts?: UsageAlertUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutUsageHistoryInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseUrl?: StringFieldUpdateOperationsInput | string
    databaseHost?: StringFieldUpdateOperationsInput | string
    databaseName?: StringFieldUpdateOperationsInput | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFee?: FloatFieldUpdateOperationsInput | number
    lastPaymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    nextPaymentDue?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentNotes?: NullableStringFieldUpdateOperationsInput | string | null
    customStorageLimitMB?: NullableIntFieldUpdateOperationsInput | number | null
    customBandwidthLimitGB?: NullableIntFieldUpdateOperationsInput | number | null
    customOrdersLimit?: NullableIntFieldUpdateOperationsInput | number | null
    customStaffLimit?: NullableIntFieldUpdateOperationsInput | number | null
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    currentStorageUsageMB?: FloatFieldUpdateOperationsInput | number
    currentBandwidthGB?: FloatFieldUpdateOperationsInput | number
    currentMonthOrders?: IntFieldUpdateOperationsInput | number
    currentStaffCount?: IntFieldUpdateOperationsInput | number
    lastBillingCalculation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMonthOverageCharges?: FloatFieldUpdateOperationsInput | number
    lastMonthTotalBill?: FloatFieldUpdateOperationsInput | number
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    maxLocations?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxDbSizeMB?: IntFieldUpdateOperationsInput | number
    maxApiRequests?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    currentDbSizeMB?: FloatFieldUpdateOperationsInput | number
    currentStorageMB?: FloatFieldUpdateOperationsInput | number
    dbLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    apiLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    limitExceededAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentRecords?: PaymentRecordUncheckedUpdateManyWithoutTenantNestedInput
    activityLogs?: TenantActivityLogUncheckedUpdateManyWithoutTenantNestedInput
    metrics?: TenantMetricsUncheckedUpdateManyWithoutTenantNestedInput
    usageAlerts?: UsageAlertUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type TenantCreateWithoutUsageAlertsInput = {
    id?: string
    slug: string
    businessName: string
    contactName: string
    contactEmail: string
    contactPhone?: string | null
    databaseUrl: string
    databaseHost: string
    databaseName: string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: $Enums.SubscriptionStatus
    trialEndsAt?: Date | string | null
    billingCycleStart?: Date | string | null
    billingCycleEnd?: Date | string | null
    monthlyFee?: number
    lastPaymentDate?: Date | string | null
    lastPaymentAmount?: number | null
    nextPaymentDue?: Date | string | null
    paymentNotes?: string | null
    customStorageLimitMB?: number | null
    customBandwidthLimitGB?: number | null
    customOrdersLimit?: number | null
    customStaffLimit?: number | null
    hasPrioritySupport?: boolean
    currentStorageUsageMB?: number
    currentBandwidthGB?: number
    currentMonthOrders?: number
    currentStaffCount?: number
    lastBillingCalculation?: Date | string | null
    lastMonthOverageCharges?: number
    lastMonthTotalBill?: number
    status?: $Enums.TenantStatus
    isActive?: boolean
    maxLocations?: number
    maxUsers?: number
    maxDbSizeMB?: number
    maxApiRequests?: number
    maxStorageMB?: number
    currentDbSizeMB?: number
    currentStorageMB?: number
    dbLimitExceeded?: boolean
    apiLimitExceeded?: boolean
    limitExceededAt?: Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activatedAt?: Date | string | null
    suspendedAt?: Date | string | null
    paymentRecords?: PaymentRecordCreateNestedManyWithoutTenantInput
    activityLogs?: TenantActivityLogCreateNestedManyWithoutTenantInput
    metrics?: TenantMetricsCreateNestedManyWithoutTenantInput
    usageHistory?: TenantUsageCreateNestedManyWithoutTenantInput
  }

  export type TenantUncheckedCreateWithoutUsageAlertsInput = {
    id?: string
    slug: string
    businessName: string
    contactName: string
    contactEmail: string
    contactPhone?: string | null
    databaseUrl: string
    databaseHost: string
    databaseName: string
    subscriptionTier?: $Enums.SubscriptionTier
    subscriptionStatus?: $Enums.SubscriptionStatus
    trialEndsAt?: Date | string | null
    billingCycleStart?: Date | string | null
    billingCycleEnd?: Date | string | null
    monthlyFee?: number
    lastPaymentDate?: Date | string | null
    lastPaymentAmount?: number | null
    nextPaymentDue?: Date | string | null
    paymentNotes?: string | null
    customStorageLimitMB?: number | null
    customBandwidthLimitGB?: number | null
    customOrdersLimit?: number | null
    customStaffLimit?: number | null
    hasPrioritySupport?: boolean
    currentStorageUsageMB?: number
    currentBandwidthGB?: number
    currentMonthOrders?: number
    currentStaffCount?: number
    lastBillingCalculation?: Date | string | null
    lastMonthOverageCharges?: number
    lastMonthTotalBill?: number
    status?: $Enums.TenantStatus
    isActive?: boolean
    maxLocations?: number
    maxUsers?: number
    maxDbSizeMB?: number
    maxApiRequests?: number
    maxStorageMB?: number
    currentDbSizeMB?: number
    currentStorageMB?: number
    dbLimitExceeded?: boolean
    apiLimitExceeded?: boolean
    limitExceededAt?: Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    updatedAt?: Date | string
    activatedAt?: Date | string | null
    suspendedAt?: Date | string | null
    paymentRecords?: PaymentRecordUncheckedCreateNestedManyWithoutTenantInput
    activityLogs?: TenantActivityLogUncheckedCreateNestedManyWithoutTenantInput
    metrics?: TenantMetricsUncheckedCreateNestedManyWithoutTenantInput
    usageHistory?: TenantUsageUncheckedCreateNestedManyWithoutTenantInput
  }

  export type TenantCreateOrConnectWithoutUsageAlertsInput = {
    where: TenantWhereUniqueInput
    create: XOR<TenantCreateWithoutUsageAlertsInput, TenantUncheckedCreateWithoutUsageAlertsInput>
  }

  export type TenantUpsertWithoutUsageAlertsInput = {
    update: XOR<TenantUpdateWithoutUsageAlertsInput, TenantUncheckedUpdateWithoutUsageAlertsInput>
    create: XOR<TenantCreateWithoutUsageAlertsInput, TenantUncheckedCreateWithoutUsageAlertsInput>
    where?: TenantWhereInput
  }

  export type TenantUpdateToOneWithWhereWithoutUsageAlertsInput = {
    where?: TenantWhereInput
    data: XOR<TenantUpdateWithoutUsageAlertsInput, TenantUncheckedUpdateWithoutUsageAlertsInput>
  }

  export type TenantUpdateWithoutUsageAlertsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseUrl?: StringFieldUpdateOperationsInput | string
    databaseHost?: StringFieldUpdateOperationsInput | string
    databaseName?: StringFieldUpdateOperationsInput | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFee?: FloatFieldUpdateOperationsInput | number
    lastPaymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    nextPaymentDue?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentNotes?: NullableStringFieldUpdateOperationsInput | string | null
    customStorageLimitMB?: NullableIntFieldUpdateOperationsInput | number | null
    customBandwidthLimitGB?: NullableIntFieldUpdateOperationsInput | number | null
    customOrdersLimit?: NullableIntFieldUpdateOperationsInput | number | null
    customStaffLimit?: NullableIntFieldUpdateOperationsInput | number | null
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    currentStorageUsageMB?: FloatFieldUpdateOperationsInput | number
    currentBandwidthGB?: FloatFieldUpdateOperationsInput | number
    currentMonthOrders?: IntFieldUpdateOperationsInput | number
    currentStaffCount?: IntFieldUpdateOperationsInput | number
    lastBillingCalculation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMonthOverageCharges?: FloatFieldUpdateOperationsInput | number
    lastMonthTotalBill?: FloatFieldUpdateOperationsInput | number
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    maxLocations?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxDbSizeMB?: IntFieldUpdateOperationsInput | number
    maxApiRequests?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    currentDbSizeMB?: FloatFieldUpdateOperationsInput | number
    currentStorageMB?: FloatFieldUpdateOperationsInput | number
    dbLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    apiLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    limitExceededAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentRecords?: PaymentRecordUpdateManyWithoutTenantNestedInput
    activityLogs?: TenantActivityLogUpdateManyWithoutTenantNestedInput
    metrics?: TenantMetricsUpdateManyWithoutTenantNestedInput
    usageHistory?: TenantUsageUpdateManyWithoutTenantNestedInput
  }

  export type TenantUncheckedUpdateWithoutUsageAlertsInput = {
    id?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    businessName?: StringFieldUpdateOperationsInput | string
    contactName?: StringFieldUpdateOperationsInput | string
    contactEmail?: StringFieldUpdateOperationsInput | string
    contactPhone?: NullableStringFieldUpdateOperationsInput | string | null
    databaseUrl?: StringFieldUpdateOperationsInput | string
    databaseHost?: StringFieldUpdateOperationsInput | string
    databaseName?: StringFieldUpdateOperationsInput | string
    subscriptionTier?: EnumSubscriptionTierFieldUpdateOperationsInput | $Enums.SubscriptionTier
    subscriptionStatus?: EnumSubscriptionStatusFieldUpdateOperationsInput | $Enums.SubscriptionStatus
    trialEndsAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleStart?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    billingCycleEnd?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    monthlyFee?: FloatFieldUpdateOperationsInput | number
    lastPaymentDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastPaymentAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    nextPaymentDue?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentNotes?: NullableStringFieldUpdateOperationsInput | string | null
    customStorageLimitMB?: NullableIntFieldUpdateOperationsInput | number | null
    customBandwidthLimitGB?: NullableIntFieldUpdateOperationsInput | number | null
    customOrdersLimit?: NullableIntFieldUpdateOperationsInput | number | null
    customStaffLimit?: NullableIntFieldUpdateOperationsInput | number | null
    hasPrioritySupport?: BoolFieldUpdateOperationsInput | boolean
    currentStorageUsageMB?: FloatFieldUpdateOperationsInput | number
    currentBandwidthGB?: FloatFieldUpdateOperationsInput | number
    currentMonthOrders?: IntFieldUpdateOperationsInput | number
    currentStaffCount?: IntFieldUpdateOperationsInput | number
    lastBillingCalculation?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    lastMonthOverageCharges?: FloatFieldUpdateOperationsInput | number
    lastMonthTotalBill?: FloatFieldUpdateOperationsInput | number
    status?: EnumTenantStatusFieldUpdateOperationsInput | $Enums.TenantStatus
    isActive?: BoolFieldUpdateOperationsInput | boolean
    maxLocations?: IntFieldUpdateOperationsInput | number
    maxUsers?: IntFieldUpdateOperationsInput | number
    maxDbSizeMB?: IntFieldUpdateOperationsInput | number
    maxApiRequests?: IntFieldUpdateOperationsInput | number
    maxStorageMB?: IntFieldUpdateOperationsInput | number
    currentDbSizeMB?: FloatFieldUpdateOperationsInput | number
    currentStorageMB?: FloatFieldUpdateOperationsInput | number
    dbLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    apiLimitExceeded?: BoolFieldUpdateOperationsInput | boolean
    limitExceededAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    features?: NullableJsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    activatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    suspendedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    paymentRecords?: PaymentRecordUncheckedUpdateManyWithoutTenantNestedInput
    activityLogs?: TenantActivityLogUncheckedUpdateManyWithoutTenantNestedInput
    metrics?: TenantMetricsUncheckedUpdateManyWithoutTenantNestedInput
    usageHistory?: TenantUsageUncheckedUpdateManyWithoutTenantNestedInput
  }

  export type PaymentRecordCreateManyTenantInput = {
    id?: string
    amount: number
    paymentDate: Date | string
    paymentMethod: string
    referenceNumber?: string | null
    billingPeriodStart: Date | string
    billingPeriodEnd: Date | string
    notes?: string | null
    receivedBy: string
    createdAt?: Date | string
  }

  export type TenantActivityLogCreateManyTenantInput = {
    id?: string
    action: string
    performedBy?: string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type TenantMetricsCreateManyTenantInput = {
    id?: string
    date: Date | string
    totalRevenue?: number
    totalOrders?: number
    activeUsers?: number
    activeLocations?: number
    createdAt?: Date | string
  }

  export type TenantUsageCreateManyTenantInput = {
    id?: string
    date: Date | string
    dbSizeMB?: number
    dbSizeBytes?: bigint | number
    apiRequests?: number
    apiRequestsByEndpoint?: NullableJsonNullValueInput | InputJsonValue
    storageSizeMB?: number
    dbOverage?: boolean
    apiOverage?: boolean
    overageAmount?: number | null
    recordedAt?: Date | string
    createdAt?: Date | string
  }

  export type UsageAlertCreateManyTenantInput = {
    id?: string
    resource: string
    level: string
    percentage: number
    current: number
    limit: number
    message: string
    isRead?: boolean
    isSent?: boolean
    sentAt?: Date | string | null
    createdAt?: Date | string
    resolvedAt?: Date | string | null
  }

  export type PaymentRecordUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    referenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    billingPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    billingPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    receivedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentRecordUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    referenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    billingPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    billingPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    receivedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PaymentRecordUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    amount?: FloatFieldUpdateOperationsInput | number
    paymentDate?: DateTimeFieldUpdateOperationsInput | Date | string
    paymentMethod?: StringFieldUpdateOperationsInput | string
    referenceNumber?: NullableStringFieldUpdateOperationsInput | string | null
    billingPeriodStart?: DateTimeFieldUpdateOperationsInput | Date | string
    billingPeriodEnd?: DateTimeFieldUpdateOperationsInput | Date | string
    notes?: NullableStringFieldUpdateOperationsInput | string | null
    receivedBy?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantActivityLogUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    superAdmin?: SuperAdminUpdateOneWithoutActivityLogsNestedInput
  }

  export type TenantActivityLogUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantActivityLogUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    performedBy?: NullableStringFieldUpdateOperationsInput | string | null
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantMetricsUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRevenue?: FloatFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    activeUsers?: IntFieldUpdateOperationsInput | number
    activeLocations?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantMetricsUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRevenue?: FloatFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    activeUsers?: IntFieldUpdateOperationsInput | number
    activeLocations?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantMetricsUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    totalRevenue?: FloatFieldUpdateOperationsInput | number
    totalOrders?: IntFieldUpdateOperationsInput | number
    activeUsers?: IntFieldUpdateOperationsInput | number
    activeLocations?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUsageUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    dbSizeMB?: FloatFieldUpdateOperationsInput | number
    dbSizeBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    apiRequests?: IntFieldUpdateOperationsInput | number
    apiRequestsByEndpoint?: NullableJsonNullValueInput | InputJsonValue
    storageSizeMB?: FloatFieldUpdateOperationsInput | number
    dbOverage?: BoolFieldUpdateOperationsInput | boolean
    apiOverage?: BoolFieldUpdateOperationsInput | boolean
    overageAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUsageUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    dbSizeMB?: FloatFieldUpdateOperationsInput | number
    dbSizeBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    apiRequests?: IntFieldUpdateOperationsInput | number
    apiRequestsByEndpoint?: NullableJsonNullValueInput | InputJsonValue
    storageSizeMB?: FloatFieldUpdateOperationsInput | number
    dbOverage?: BoolFieldUpdateOperationsInput | boolean
    apiOverage?: BoolFieldUpdateOperationsInput | boolean
    overageAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantUsageUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    dbSizeMB?: FloatFieldUpdateOperationsInput | number
    dbSizeBytes?: BigIntFieldUpdateOperationsInput | bigint | number
    apiRequests?: IntFieldUpdateOperationsInput | number
    apiRequestsByEndpoint?: NullableJsonNullValueInput | InputJsonValue
    storageSizeMB?: FloatFieldUpdateOperationsInput | number
    dbOverage?: BoolFieldUpdateOperationsInput | boolean
    apiOverage?: BoolFieldUpdateOperationsInput | boolean
    overageAmount?: NullableFloatFieldUpdateOperationsInput | number | null
    recordedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UsageAlertUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    percentage?: IntFieldUpdateOperationsInput | number
    current?: FloatFieldUpdateOperationsInput | number
    limit?: FloatFieldUpdateOperationsInput | number
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isSent?: BoolFieldUpdateOperationsInput | boolean
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UsageAlertUncheckedUpdateWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    percentage?: IntFieldUpdateOperationsInput | number
    current?: FloatFieldUpdateOperationsInput | number
    limit?: FloatFieldUpdateOperationsInput | number
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isSent?: BoolFieldUpdateOperationsInput | boolean
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type UsageAlertUncheckedUpdateManyWithoutTenantInput = {
    id?: StringFieldUpdateOperationsInput | string
    resource?: StringFieldUpdateOperationsInput | string
    level?: StringFieldUpdateOperationsInput | string
    percentage?: IntFieldUpdateOperationsInput | number
    current?: FloatFieldUpdateOperationsInput | number
    limit?: FloatFieldUpdateOperationsInput | number
    message?: StringFieldUpdateOperationsInput | string
    isRead?: BoolFieldUpdateOperationsInput | boolean
    isSent?: BoolFieldUpdateOperationsInput | boolean
    sentAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    resolvedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TenantActivityLogCreateManySuperAdminInput = {
    id?: string
    tenantId: string
    action: string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: string | null
    createdAt?: Date | string
  }

  export type TenantActivityLogUpdateWithoutSuperAdminInput = {
    id?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    tenant?: TenantUpdateOneRequiredWithoutActivityLogsNestedInput
  }

  export type TenantActivityLogUncheckedUpdateWithoutSuperAdminInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TenantActivityLogUncheckedUpdateManyWithoutSuperAdminInput = {
    id?: StringFieldUpdateOperationsInput | string
    tenantId?: StringFieldUpdateOperationsInput | string
    action?: StringFieldUpdateOperationsInput | string
    details?: NullableJsonNullValueInput | InputJsonValue
    ipAddress?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use TenantCountOutputTypeDefaultArgs instead
     */
    export type TenantCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TenantCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SuperAdminCountOutputTypeDefaultArgs instead
     */
    export type SuperAdminCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SuperAdminCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TenantDefaultArgs instead
     */
    export type TenantArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TenantDefaultArgs<ExtArgs>
    /**
     * @deprecated Use PaymentRecordDefaultArgs instead
     */
    export type PaymentRecordArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = PaymentRecordDefaultArgs<ExtArgs>
    /**
     * @deprecated Use SuperAdminDefaultArgs instead
     */
    export type SuperAdminArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = SuperAdminDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TenantActivityLogDefaultArgs instead
     */
    export type TenantActivityLogArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TenantActivityLogDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TenantMetricsDefaultArgs instead
     */
    export type TenantMetricsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TenantMetricsDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TenantUsageDefaultArgs instead
     */
    export type TenantUsageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TenantUsageDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UsageAlertDefaultArgs instead
     */
    export type UsageAlertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UsageAlertDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}