import { Document, Model, ProjectionType, QueryOptions, RootFilterQuery } from "mongoose";

export abstract class AbstractRepository<T> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>){
    const doc = new this.model(data);
    return await doc.save() as Document<T>;
  }

  async getOne(filter: RootFilterQuery<T>,projection?:ProjectionType<T>,Options?:QueryOptions<T>) {
    return this.model.findOne(filter,projection,Options).exec();
  }
  async update(filter: RootFilterQuery<T>, data: Partial<T>) {
    return this.model.updateOne(filter, data).exec();
  }

  async delete(filter: RootFilterQuery<T>) {
    return this.model.deleteOne(filter).exec();
  }
}
    