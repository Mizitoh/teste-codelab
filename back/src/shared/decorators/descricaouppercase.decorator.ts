export function DescricaoToUppercase() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const metodoOriginal = descriptor.value;

    descriptor.value = function (...args: any[]) {
      let DTO: any;

      for (const arg of args) {
        if (typeof arg === 'object' && !Array.isArray(arg)) {
          DTO = arg;
          break;
        }
      }

      if (DTO && DTO.descricao && typeof DTO.descricao === 'string') {
        DTO.descricao = DTO.descricao.toUpperCase();
      }

      return metodoOriginal.apply(this, args);
    };
  };
}
