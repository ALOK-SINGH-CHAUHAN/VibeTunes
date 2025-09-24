import ThemeToggle from '../ThemeToggle'

export default function ThemeToggleExample() {
  return (
    <div className="p-8 bg-background min-h-screen">
      <div className="flex justify-end">
        <ThemeToggle />
      </div>
      <div className="mt-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Theme Toggle Test</h2>
        <p className="text-muted-foreground">
          Click the button above to toggle between light and dark themes
        </p>
      </div>
    </div>
  )
}