declare module "alea" {
  interface AleaGenerator {
    (): number;
  }

  interface AleaConstructor {
    new (seed?: number | string): AleaGenerator;
  }

  const Alea: AleaConstructor;
  export = Alea;
}
