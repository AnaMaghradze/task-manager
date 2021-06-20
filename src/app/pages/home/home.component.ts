import { Component, OnInit } from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';
import { IList } from 'src/app/shared/interfaces/list.interface';
import { ITask } from 'src/app/shared/interfaces/task.interface';
import { IUser } from 'src/app/shared/interfaces/user.interface';
import { TaskManagerService } from 'src/app/shared/services/task-manager.service';
import { FadeInOut } from 'src/app/shared/animations/fadeInOut.animation';
import { UniqueIdService } from 'src/app/shared/services/unique-id.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { ThemeService } from 'src/app/shared/services/theme.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [FadeInOut],
})
export class HomeComponent implements OnInit {
  lists: IList[] = [];
  tasks: ITask[] = [];
  listIsChosen = false;
  listModalVisible = false;
  modalInputList: IList = { id: '', name: '', listGroupId: '' };
  user!: IUser;
  theme = false;

  constructor(
    private tms: TaskManagerService,
    private guid: UniqueIdService,
    private authService: AuthService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    // get authorized user, then lists of the user
    this.authService
      .getAuthorizedUser()
      .pipe(
        tap((user) => (this.user = user)),
        switchMap((user) =>
          this.tms.getAllLists().pipe(
            map((resp: IList[]) => {
              this.lists = resp.filter(
                (list) => list.listGroupId == user.listGroupId
              );
            })
          )
        )
      )
      .subscribe();
    // theme
    this.themeService.isThemeDark
      .pipe(tap((th) => (this.theme = th)))
      .subscribe();
  }

  openList(list: IList) {
    this.tasks = [];
    this.listIsChosen = true;
    this.lists.forEach((l) => {
      l.isOpen = l.id == list.id;
    });
    this.tms.openedList = list; // currently opened list
    // get all task in the list
    this.tms
      .getAllTasks()
      .pipe(
        map((tasks) => {
          this.tasks = tasks.filter((task) => task.listId == list.id);
        })
      )
      .subscribe();
  }

  // Modal appears when user clicks list settings
  openListModal(list: IList) {
    this.modalInputList = list;
    this.listModalVisible = true;
  }

  createList(value: any) {
    if (value.name) {
      let id = this.guid.generateId();
      let list: IList = {
        id: id,
        name: value.name,
        listGroupId: this.user.listGroupId,
      };
      this.tms.createList(list).subscribe();
      this.lists.push(list); // update view
    }
  }

  updateList(e: any, list: IList) {
    let updatedListName = e.updatedListName;
    if (list && updatedListName) {
      this.listModalVisible = false;
      list.name = updatedListName;
      this.tms.updateList(list).subscribe();
    }
  }

  deleteList(list: IList) {
    if (list) {
      let id = list.id;
      let index = this.lists.findIndex((list) => id == list.id);
      this.lists.splice(index, 1);
      // this will also delete the tasks related to the deleted list with listId-s
      this.tms.deleteList(id).subscribe();
      this.listModalVisible = false;
      this.tasks = []; // remove deleted tasks from view;
    }
  }

  // ********* TASKS **********
  toggleTask(task: ITask) {
    task.isDone = !task.isDone;
    this.tms.updateTask(task).subscribe();
  }

  createTask(value: any) {
    if (value.name && this.tms.openedList) {
      let id = this.guid.generateId();
      let task = {
        id: id,
        name: value.name,
        listId: this.tms.openedList.id,
        isDone: false,
      };
      this.tms.createTask(task).subscribe();
      this.tasks.push(task); // update view
    }
  }

  deleteTask(task: ITask) {
    let index = this.tasks.findIndex((t) => t.id == task.id);
    this.tasks.splice(index, 1);
    this.tms.deleteTask(task.id).subscribe();
  }

  // filter taks by done/todo/all using filter dropdown
  filterTasks(by: any) {
    if (this.listIsChosen) {
      this.tasks = [];
      this.tms
        .getAllTasks()
        .pipe(
          tap((resp: ITask[]) => {
            if (by.toLowerCase() === 'all') {
              this.tasks = resp.filter(
                (task) => this.tms.openedList.id == task.listId
              );
            } else {
              let taskIsDone = by.toLowerCase() === 'done';
              this.tasks = resp.filter(
                (task) =>
                  task.isDone == taskIsDone &&
                  this.tms.openedList.id == task.listId
              );
            }
          })
        )
        .subscribe();
    }
  }

  // sign out when button is clicked on sidebar
  signOut() {
    this.authService.signOut();
  }

  // change theme via ThemeService when theme toggle is clicked on sidebar
  changeTheme(isThemeDark: boolean) {
    this.themeService.setDarkTheme(isThemeDark);
  }
}
