import { useState, useEffect } from 'react';
import { Calendar, Plus } from 'lucide-react';
import { supabase } from './supabaseClient';

function App() {
  const [trainings, setTrainings] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTrainings();
  }, []);

  async function fetchTrainings() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('trainings')
        .select('*')
        .order('id', { ascending: false });

      if (error) throw error;
      setTrainings(data || []);
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const weekDays = [
    'Domingo',
    'Segunda-feira',
    'Terça-feira',
    'Quarta-feira',
    'Quinta-feira',
    'Sexta-feira',
    'Sábado'
  ];

  const trainingTypes = [
    'Peito e Ombro',
    'Costas e Bíceps',
    'Perna Completo (com foco em costas)',
    'Ombro e panturrilha',
    'Bíceps e Tríceps',
    'Cardio'
  ];

  const getTrainingCounts = () => {
    const counts = {};
    trainingTypes.forEach(type => {
      counts[type] = trainings.filter(t => t.type === type).length;
    });
    return counts;
  };

  const addTraining = async () => {
    if (selectedDay && selectedType) {
      const today = new Date();
      const newTraining = {
        day: selectedDay,
        type: selectedType,
        date: today.toLocaleDateString('pt-BR'),
      };

      try {
        const { error } = await supabase
          .from('trainings')
          .insert(newTraining);

        if (error) throw error;
        
        fetchTrainings(); // Recarrega os treinos
        setSelectedDay('');
        setSelectedType('');
        setIsAddingMode(false);
      } catch (error) {
        console.error('Erro ao adicionar treino:', error);
      }
    }
  };

  const removeTraining = async (id) => {
    try {
      const { error } = await supabase
        .from('trainings')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      fetchTrainings(); // Recarrega os treinos
    } catch (error) {
      console.error('Erro ao remover treino:', error);
    }
  };

  const trainingCounts = getTrainingCounts();

  if (isLoading) {
    return (
      <div className="max-w-sm mx-auto p-2 text-center">
        Carregando...
      </div>
    );
  }

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

          <div className="mt-2 grid grid-cols-2 gap-2">
            {Object.entries(trainingCounts).map(([type, count]) => (
              count > 0 && (
                <div key={type} className="bg-gray-50 p-2 rounded text-sm">
                  <span className="font-medium">{type}:</span> {count}
                </div>
              )
            ))}
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

            <select 
              className="w-full p-2 border rounded text-sm"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">Tipo de treino</option>
              {trainingTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
            
            <div className="flex gap-2">
              <button
                className="flex-1 bg-blue-500 text-white p-2 rounded text-sm hover:bg-blue-600"
                onClick={addTraining}
                disabled={!selectedDay || !selectedType}
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
                      <div className="font-medium">
                        {training.type}
                      </div>
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