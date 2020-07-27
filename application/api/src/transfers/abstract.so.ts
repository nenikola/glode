export class SystemOperationImpl implements SystemOperation {
  results: any;
  constructor() {
    this.executeSO();
  }
  validate() {
    throw new Error('Method not implemented yet');
  }
  execute() {
    throw new Error('Method not implemented yet');
  }
  getResults() {
    throw new Error('Method not implemented yet');
  }
  private executeSO() {
    this.validate();
    this.execute();
  }
}

interface SystemOperation {
  validate();
  execute();
}
