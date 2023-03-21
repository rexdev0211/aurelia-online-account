import { RenderInstruction, ValidateResult } from "aurelia-validation";

export class BootstrapFormRenderer {
  validClassName = 'text-success';
  invalidClassName = 'text-danger';
  extraClassName = 'validation-message-padding';
  validationMessageClassName = 'form-group';

  render(instruction: RenderInstruction) {
    for (let { result, elements } of instruction.unrender) {
      for (let element of elements) {
        this.remove(element, result);
      }
    }

    for (let { result, elements } of instruction.render) {
      for (let element of elements) {
        this.add(element, result);
      }
    }
  }

  add(element: Element, result: ValidateResult) {
    const formGroup = element.closest('.form-group');
    if (!formGroup) {
      return;
    }

    if (result.valid) {
      // if (!formGroup.classList.contains(this.invalidClassName)) {
      //   formGroup.classList.add(this.validClassName);
      // }
    } else {
      // add the has-error class to the enclosing form-group div
      // formGroup.classList.remove(this.validClassName);
      // formGroup.classList.add(this.invalidClassName);

      const oldMessage = formGroup.querySelector(`.${this.invalidClassName}`);
      if (oldMessage) oldMessage.parentNode.removeChild(oldMessage);

      // add help-block

      const messageContainer = formGroup.querySelector('.validation-errors')|| document.createElement('div');
      messageContainer.className = 'validation-errors';

      const message = document.createElement('div');
      message.className = `${this.invalidClassName} ${this.extraClassName}`;
      message.textContent = result.message;
      message.id = `validation-message-${result.id}`;
      messageContainer.appendChild(message);
      formGroup.appendChild(messageContainer);
    }
  }

  remove(element: Element, result: ValidateResult) {
    const formGroup = element.closest('.form-group');
    if (!formGroup) {
      return;
    }

    if (result.valid) {
      if (formGroup.classList.contains(this.invalidClassName)) {
        formGroup.classList.remove(this.invalidClassName);
      }
    } else {
      // remove help-block
      const nodesToRemove = formGroup.querySelectorAll(`#validation-message-${result.id}`);
      if (nodesToRemove) {
        nodesToRemove.forEach(node=>node.parentNode.removeChild(node));

        // remove the has-error class from the enclosing form-group div
        if (formGroup.querySelectorAll('.' + this.validationMessageClassName).length === 0) {
          // formGroup.classList.remove(this.invalidClassName);
        }
      }
    }
  }
}
