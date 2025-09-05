class TableComponent extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'data'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, _, newValue) {
    this[name] = newValue;
    this.render();
  }

  render() {
    // Clear shadow DOM before re-render
    this.shadowRoot.innerHTML = `
      <div id="table-container"></div>
      <sub>${this.title || ''}</sub>

      <style>
        :host {
          display: block;
          text-align: center;
          padding: 1rem;
        }

        sub {
          display: block;
          margin-top: 0.75rem;
          font-size: 0.9rem;
          font-style: italic;
          color: #c0c3d7;
        }

        /* Custom Grid.js table styles */
        .custom-grid-table {
          border: 1px solid #e6e6ef !important;
          color: #e6e6ef !important;
          border-collapse: collapse;
          margin: 1rem auto;
          max-width: 600px;
          border-radius: 6px;
          overflow: hidden;
        }

        .custom-grid-table th,
        .custom-grid-table td {
          border: 1px solid #e6e6ef !important;
          color: #e6e6ef !important;
          padding: 8px 12px;
        }

        /* Header row */
        .custom-grid-table thead th {
          background-color: #1a1c28 !important;
          font-weight: bold;
          text-transform: uppercase;
        }

        /* Hover effect */
        .custom-grid-table tbody tr:hover {
          background-color: #2d3045 !important;
        }

        /* Selected row */
        .custom-grid-table tbody tr:active,
        .custom-grid-table tbody tr.selected {
          background-color: #3a3d55 !important;
        }
      </style>
    `;

    // Parse JSON from attribute
    let tableData = { columns: [], rows: [] };
    try {
      if (this.data) {
        tableData = JSON.parse(this.data);
      }
    } catch (e) {
      console.error("Invalid JSON in <table-component data>:", e);
    }

    // Render Grid.js inside shadow root
    if (tableData.columns && tableData.rows) {
      new gridjs.Grid({
        columns: tableData.columns,
        data: tableData.rows,
        className: {
          table: 'custom-grid-table'
        }
      }).render(this.shadowRoot.querySelector('#table-container'));
    }
  }
}

customElements.define('table-component', TableComponent);
