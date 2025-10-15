function sortObject(o: any): any {
    if (Array.isArray(o)) return o.map(sortObject);
    if (o && typeof o === 'object') {
      return Object.keys(o).sort().reduce((acc, k) => (acc[k] = sortObject(o[k]), acc), {} as any);
    }
    return o;
  }

  export {sortObject}