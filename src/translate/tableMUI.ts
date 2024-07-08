interface PaginationText {
  labelDisplayedRows: ({ from, to, count }: { from: number, to: number, count: number }) => string;
  labelRowsPerPage: string;
}

interface ColumnMenuText {
  columnMenuSortAsc: string;
  columnMenuSortDesc: string;
  columnMenuFilter: string;
  columnMenuHideColumn: string;
  columnMenuShowColumns: string;
}

interface ToolbarText {
  toolbarFilters: string;
  toolbarFiltersTooltipShow: string;
  toolbarFiltersTooltipHide: string;
  toolbarColumns: string;
  toolbarColumnsTooltipShow: string;
  toolbarColumnsTooltipHide: string;
  toolbarDensity: string;
  toolbarDensityLabel: string;
  toolbarDensityCompact: string;
  toolbarDensityStandard: string;
  toolbarDensityComfortable: string;
}

interface ColumnsPanelText {
  columnsPanelTextFieldLabel: string;
  columnsPanelTextFieldPlaceholder: string;
  columnsPanelDragIconLabel: string;
  columnsPanelShowAllButton: string;
  columnsPanelHideAllButton: string;
}

interface FilterPanelText {
  filterPanelOperators: string;
  filterPanelOperatorAnd: string;
  filterPanelOperatorOr: string;
}

interface CommonActionsText {
  toolbarDensity: string;
  toolbarDensityLabel: string;
  toolbarDensityCompact: string;
  toolbarDensityStandard: string;
  toolbarDensityComfortable: string;
}

interface ColumnHeaderText {
  columnHeaderFiltersTooltipActive: (count: number) => string;
}

interface RowsSelectedFooterText {
  footerRowSelected: (count: number) => string;
}

interface LocaleText {
  MuiTablePagination: PaginationText;
  toolbarFilters: string;
  toolbarFiltersTooltipShow: string;
  toolbarFiltersTooltipHide: string;
  toolbarColumns: string;
  toolbarColumnsTooltipShow: string;
  toolbarColumnsTooltipHide: string;
  columnsPanelTextFieldLabel: string;
  columnsPanelTextFieldPlaceholder: string;
  columnsPanelDragIconLabel: string;
  columnsPanelShowAllButton: string;
  columnsPanelHideAllButton: string;
  filterPanelOperators: string;
  filterPanelOperatorAnd: string;
  filterPanelOperatorOr: string;
  toolbarDensity: string;
  toolbarDensityLabel: string;
  toolbarDensityCompact: string;
  toolbarDensityStandard: string;
  toolbarDensityComfortable: string;
  columnMenuSortAsc: string;
  columnMenuSortDesc: string;
  columnMenuFilter: string;
  columnMenuHideColumn: string;
  columnMenuShowColumns: string;
  columnMenuManageColumns: string;
  columnHeaderFiltersTooltipActive: (count: number) => string;
  footerRowSelected: (count: number) => string;
}

export const localeText: LocaleText = {
  MuiTablePagination: {
    labelDisplayedRows: ({ from, to, count }) => `${from}–${to} z ${count !== -1 ? count : `więcej niż ${to}`}`,
    labelRowsPerPage: 'Wiersze na stronę:',
  },
  toolbarFilters: 'Filtry',
  toolbarFiltersTooltipShow: 'Pokaż filtry',
  toolbarFiltersTooltipHide: 'Ukryj filtry',
  toolbarColumns: 'Kolumny',
  toolbarColumnsTooltipShow: 'Pokaż kolumny',
  toolbarColumnsTooltipHide: 'Ukryj kolumny',
  columnsPanelTextFieldLabel: 'Znajdź kolumnę',
  columnsPanelTextFieldPlaceholder: 'Tytuł kolumny',
  columnsPanelDragIconLabel: 'Zmień kolejność kolumn',
  columnsPanelShowAllButton: 'Pokaż wszystkie',
  columnsPanelHideAllButton: 'Ukryj wszystkie',
  filterPanelOperators: 'Operator',
  filterPanelOperatorAnd: 'I',
  filterPanelOperatorOr: 'Lub',
  toolbarDensity: 'Gęstość',
  toolbarDensityLabel: 'Gęstość',
  toolbarDensityCompact: 'Kompaktowy',
  toolbarDensityStandard: 'Standardowy',
  toolbarDensityComfortable: 'Komfortowy',
  columnMenuSortAsc: 'Sortuj rosnąco',
  columnMenuSortDesc: 'Sortuj malejąco',
  columnMenuFilter: 'Filtr',
  columnMenuHideColumn: 'Ukryj kolumnę',
  columnMenuShowColumns: 'Pokaż kolumny',
  columnMenuManageColumns: "Zarządzaj kolumnami",
  columnHeaderFiltersTooltipActive: (count) => `${count} aktywny(ych) filtr(ów)`,
  footerRowSelected: (count) => count !== 1 ? `${count} wiersze wybrane` : `${count} wiersz wybrany`,
};