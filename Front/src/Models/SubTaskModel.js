class SubtaskModel {
    constructor(id, title, description, notes, images, requiredPhotosCount, requiredNotesCount, isFinished, taskId, userId, task, user) {
      this.id = id;
      this.title = title;
      this.description = description;
      this.notes = notes;
      this.images = images;
      this.requiredPhotosCount = requiredPhotosCount;
      this.requiredNotesCount = requiredNotesCount;
      this.isFinished = isFinished;
      this.taskId = taskId;
      this.userId = userId;
      this.task = task;
      this.user = user;
    }
  }
  
  export default SubtaskModel;
  