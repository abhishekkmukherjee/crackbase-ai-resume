import ResumeForm from './components/ResumeForm';
import EducationForm from './components/EducationForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            CrackBase Resume AI
          </h1>
          <p className="text-xl text-gray-600">
            Create your professional resume with AI assistance
          </p>
        </div>
        
        <ResumeForm />
        

      </div>
    </main>
  );
}
