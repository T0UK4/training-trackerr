import { useState } from 'react';
import { Calendar, Plus } from 'lucide-react';

function App() {
  const [trainings, setTrainings] = useState([]);
  const [currentTraining, setCurrentTraining] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [isAddingMode, setIsAddingMode] = useState(false);

  const weekDays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
  ];

  const addTraining = () => {
    if (currentTraining.trim() && selectedDay) {
      const today = new Date();
      const newTraining = {
        id: Date.now(),
        day: selectedDay,
        training: currentTraining,
        date: today.toLocaleDateString('pt-BR'),
      };
      setTrainings([...trainings, newTraining]);
      setCurrentTraining('');
      setSelectedDay('');
      setIsAddingMode(false);
    }
  };

  const removeTraining = (id) => {
    setTrainings(trainings.filter(training => training.id !== id));
  };

  return (
    <div className="max-w-sm mx-auto p-2">
      <div className="bg-white shadow rounded-lg mb-4">
        <div className="p-4">
          <div className="text-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Meus Treinos
            </div>
            <button
              onClick={() => setIsAddingMode(true)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <div className="text-sm text-gray-500">
            Total de treinos: {trainings.length}
          </div>
        </div>

        {isAddingMode && (
          <div className="p-4 space-y-2 border-t">
            <select 
              className="w-full p-2 border rounded text-sm"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option value="">Escolha o dia</option>
              {weekDays.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            
            <input
              type="text"
              value={currentTraining}
              onChange={(e) => setCurrentTraining(e.target.value)}
              placeholder="Qual é o treino?"
              className="w-full p-2 border rounded text-sm"
            />
            
            <div className="flex gap-2">
              <button
                className="flex-1 bg-blue-500 text-white p-2 rounded text-sm hover:bg-blue-600"
                onClick={addTraining}
                disabled={!selectedDay || !currentTraining.trim()}
              >
                Salvar
              </button>
              <button
                className="flex-1 border p-2 rounded text-sm hover:bg-gray-50"
                onClick={() => setIsAddingMode(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-2">
        {weekDays.map(day => {
          const dayTrainings = trainings.filter(t => t.day === day);
          if (dayTrainings.length === 0) return null;

          return (
            <div key={day} className="bg-white shadow rounded-lg overflow-hidden">
              <div className="py-2 px-4 bg-gray-50">
                <h3 className="font-medium text-sm">{day}</h3>
              </div>
              <div className="p-2">
                <div className="space-y-1">
                  {dayTrainings.map(training => (
                    <div 
                      key={training.id} 
                      className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                    >
                      <span>{training.training}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{training.date}</span>
                        <button
                          onClick={() => removeTraining(training.id)}
                          className="h-6 w-6 flex items-center justify-center text-red-500 hover:bg-gray-100 rounded-full"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;