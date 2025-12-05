export interface IAuthor {
    id: number;
    nombre: string;
    pais: string;
    isActive: boolean;
}

export let authors_db: IAuthor[] = [
    // Literatura Latinoamericana
    { id: 1, nombre: 'Gabriel García Márquez', pais: 'Colombia', isActive: true },
    { id: 2, nombre: 'Mario Vargas Llosa', pais: 'Perú', isActive: true },
    { id: 3, nombre: 'Isabel Allende', pais: 'Chile', isActive: true },
    { id: 4, nombre: 'Julio Cortázar', pais: 'Argentina', isActive: true },
    { id: 5, nombre: 'Jorge Luis Borges', pais: 'Argentina', isActive: true },
    
    // Literatura Española
    { id: 6, nombre: 'Miguel de Cervantes', pais: 'España', isActive: true },
    { id: 7, nombre: 'Federico García Lorca', pais: 'España', isActive: true },
    
    // Literatura Inglesa
    { id: 8, nombre: 'William Shakespeare', pais: 'Inglaterra', isActive: true },
    { id: 9, nombre: 'Jane Austen', pais: 'Inglaterra', isActive: true },
    
    // Literatura Norteamericana
    { id: 10, nombre: 'Ernest Hemingway', pais: 'Estados Unidos', isActive: true },
    { id: 11, nombre: 'Edgar Allan Poe', pais: 'Estados Unidos', isActive: true },
    
    // Literatura Rusa
    { id: 12, nombre: 'Fiódor Dostoyevski', pais: 'Rusia', isActive: true },
    { id: 13, nombre: 'León Tolstói', pais: 'Rusia', isActive: true },
    
    // Inactivos (ejemplo)
    { id: 14, nombre: 'Autor Inactivo 1', pais: 'México', isActive: false },
    { id: 15, nombre: 'Autor Inactivo 2', pais: 'Brasil', isActive: false },
];