import MoodInput from '../MoodInput'

export default function MoodInputExample() {
  return (
    <div className="p-8 bg-background min-h-screen">
      <MoodInput
        onSubmit={(mood) => console.log('Mood submitted:', mood)}
        isLoading={false}
      />
    </div>
  )
}