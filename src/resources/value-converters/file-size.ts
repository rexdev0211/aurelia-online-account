import * as filesize from 'filesize/lib/filesize.es6';

export class FileSizeValueConverter {
  toView(value) {
    return filesize(value);
  }

  // fromView(value) {
  // }
}

