import { Edit, Trash2 } from 'lucide-react';
import React from 'react';
import { Entity } from '../../../types/templates';
import Button from '../../ui/Button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../ui/alert-dialog';
import { Badge } from '../../ui/badge';

interface EntityListProps {
  entities: Entity[];
  handleStartEditEntity: (index: number) => void;
  handleDeleteEntity: (index: number) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  entityToDelete: number | null;
  setEntityToDelete: React.Dispatch<React.SetStateAction<number | null>>;
}

const EntityList: React.FC<EntityListProps> = ({
  entities,
  handleStartEditEntity,
  handleDeleteEntity,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  entityToDelete,
  setEntityToDelete,
}) => {
  if (entities.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-slate-200 py-8 text-center dark:border-slate-700">
        <p className="text-slate-500 dark:text-slate-400">
          No entities defined yet. Add an entity to start building your data model.
        </p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className="w-full">
      {entities.map((entity, idx) => (
        <AccordionItem key={idx} value={`entity-${idx}`}>
          <div className="flex items-center">
            <AccordionTrigger className="flex-grow px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800">
              <div className="flex items-center space-x-2">
                <span>{entity.name}</span>
                <Badge variant="outline" className="ml-2">
                  {entity.fields?.length || 0} fields
                </Badge>
              </div>
            </AccordionTrigger>
            <div className="mr-4 flex space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => handleStartEditEntity(idx)}
              >
                <Edit size={16} />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger
                  onClick={(e: { stopPropagation: () => void }) => {
                    e.stopPropagation();
                    setEntityToDelete(idx);
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  <Button type="button" variant="ghost" size="sm">
                    <Trash2 size={16} />
                  </Button>
                </AlertDialogTrigger>
                {isDeleteDialogOpen && entityToDelete === idx && (
                  <AlertDialogContent
                    isOpen={isDeleteDialogOpen}
                    onClose={() => {
                      setIsDeleteDialogOpen(false);
                      setEntityToDelete(null);
                    }}
                  >
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete {entity.name}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete the entity and cannot be undone.
                        Make sure this entity is not used in any relationships.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel
                        onClick={() => {
                          setIsDeleteDialogOpen(false);
                          setEntityToDelete(null);
                        }}
                      >
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          if (entityToDelete !== null) {
                            handleDeleteEntity(entityToDelete);
                          }
                          setIsDeleteDialogOpen(false);
                          setEntityToDelete(null);
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                )}
              </AlertDialog>
            </div>
          </div>
          <AccordionContent className="px-4 py-2">
            <div className="mb-2 text-slate-600 dark:text-slate-300">
              {entity.description}
            </div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Fields:</div>
              {entity.fields && entity.fields.length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {entity.fields.map((field, fieldIdx) => (
                    <div
                      key={fieldIdx}
                      className="flex items-center justify-between rounded-md bg-slate-50 p-2 dark:bg-slate-800"
                    >
                      <div>
                        <span className="font-medium">{field.name}</span>
                        <span className="ml-2 text-slate-500 dark:text-slate-400">
                          ({field.type})
                        </span>
                        <div className="mt-1 flex space-x-1">
                          {field.required && (
                            <Badge variant="outline" className="text-xs">
                              Required
                            </Badge>
                          )}
                          {field.unique && (
                            <Badge variant="outline" className="text-xs">
                              Unique
                            </Badge>
                          )}
                          {field.primaryKey && (
                            <Badge variant="outline" className="text-xs">
                              PK
                            </Badge>
                          )}
                          {field.generated && (
                            <Badge variant="outline" className="text-xs">
                              Generated
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-slate-500 dark:text-slate-400">
                  No fields defined for this entity.
                </div>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default EntityList; 