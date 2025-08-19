import React, { useState, useMemo } from 'react';
import { CheckSquare } from 'lucide-react';
import { useTodos } from './hooks/useTodos';
import { TodoCard } from './components/TodoCard';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { FilterBar } from './components/FilterBar';
import { ErrorMessage } from './components/ErrorMessage';
import { StatsBar } from './components/StatsBar';
import { filterTodos, getTodoStats } from './utils/todoUtils';

function App() {
  const { todos, loading, error, refetch } = useTodos();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, searchTerm, filter);
  }, [todos, searchTerm, filter]);

  const stats = useMemo(() => {
    return getTodoStats(todos);
  }, [todos]);

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <ErrorMessage message={error} onRetry={refetch} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg">
              <CheckSquare className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              JSONPlaceholder Todos
            </h1>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Exploring the JSONPlaceholder API with a beautiful, responsive todo interface
          </p>
        </div>

        {/* Stats Bar */}
        {!loading && <StatsBar {...stats} />}

        {/* Filter Bar */}
        {!loading && (
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            filter={filter}
            onFilterChange={setFilter}
            totalCount={stats.totalCount}
            completedCount={stats.completedCount}
          />
        )}

        {/* Content */}
        {loading ? (
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 12 }, (_, i) => (
              <LoadingSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            {filteredTodos.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-white/20 max-w-md mx-auto">
                  <CheckSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">No todos found</h3>
                  <p className="text-gray-500">
                    {searchTerm ? 'Try adjusting your search terms' : 'No todos match the selected filter'}
                  </p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {filter === 'all' ? 'All Todos' : 
                     filter === 'completed' ? 'Completed Todos' : 'Pending Todos'}
                    <span className="ml-2 text-lg font-normal text-gray-500">
                      ({filteredTodos.length})
                    </span>
                  </h2>
                </div>
                
                <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {filteredTodos.map((todo) => (
                    <TodoCard key={todo.id} todo={todo} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;