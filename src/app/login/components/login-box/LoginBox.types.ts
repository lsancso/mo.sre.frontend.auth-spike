export type LoginBoxProps = {
  userId: string
  validateAndSaveUser: VoidFunction
  session: {
    uuid: string
    name: string
  }
}
