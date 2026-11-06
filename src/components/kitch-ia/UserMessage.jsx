function UserMessage({ texto }) {
  return (
    <div className="flex justify-end">
      <p className="max-w-[85%] rounded-3xl rounded-br-lg bg-primary px-4 py-3 text-sm font-medium leading-relaxed text-white">
        {texto}
      </p>
    </div>
  )
}

export default UserMessage
