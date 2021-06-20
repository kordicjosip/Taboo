interface NotificationInterface {
  message: any;
  message_type: string;
}

export class Notification {
  message: any;
  message_type: string;

  constructor(json: NotificationInterface) {
    this.message = json.message;
    this.message_type = json.message_type;
  }
}
