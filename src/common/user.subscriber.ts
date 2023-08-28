// import {
//   DataSource,
//   EntitySubscriberInterface,
//   EventSubscriber,
//   InsertEvent,
//   UpdateEvent,
// } from 'typeorm';
// import { BaseEntity } from './BaseEntity';
//
// @EventSubscriber()
// export class UserSubscriber implements EntitySubscriberInterface<BaseEntity> {
//   constructor(
//     dataSource: DataSource,
//     private readonly cls: ClsService,
//   ) {
//     dataSource.subscribers.push(this);
//   }
//   listenTo() {
//     return BaseEntity;
//   }
//   beforeInsert(event: InsertEvent<BaseEntity>) {
//     event.entity.created_by = this.cls.get('user');
//   }
//
//   beforeUpdate(event: UpdateEvent<BaseEntity>) {
//     event.entity.updated_by = this.cls.get('user');
//   }
// }
