import {toastController} from '@ionic/core'

const Toast = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m('ion-toast', {
        oncreate: ({ dom }) => {
          toastController.create({
            component: dom,
            message:mdl.toast.msg(),
            duration: mdl.toast.duration(),
            showCloseButton: true,
            animated: true,
            color: mdl.toast.status() ? 'success' : 'danger'
          }).then(toast =>toast.present())
        },
      },
      )
  }
}



export default Toast
