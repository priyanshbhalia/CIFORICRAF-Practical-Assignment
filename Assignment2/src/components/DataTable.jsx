import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Filter, 
  ArrowUpDown, 
  RefreshCw 
} from 'lucide-react';

export default function DataTable({ records }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  
  // Sort State: { key: string, direction: 'asc' | 'desc' | null }
  const [sortConfig, setSortConfig] = useState({ key: 'plantingDate', direction: 'desc' });
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Gather unique options for dropdowns dynamically from active records
  const uniqueDistricts = useMemo(() => {
    return [...new Set(records.map(r => r.district))].sort();
  }, [records]);

  const uniqueSpecies = useMemo(() => {
    return [...new Set(records.map(r => r.species))].sort();
  }, [records]);

  const uniqueStatuses = useMemo(() => {
    return [...new Set(records.map(r => r.healthStatus))].sort();
  }, [records]);

  // Handle Sort Toggle
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    } else if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = null; // Reset sort
    }
    setSortConfig({ key, direction });
    setCurrentPage(1); // Reset to page 1 on sort change
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('');
    setSelectedSpecies('');
    setSelectedStatus('');
    setSortConfig({ key: 'plantingDate', direction: 'desc' });
    setCurrentPage(1);
  };

  // Filter and Sort Pipeline
  const filteredAndSortedRecords = useMemo(() => {
    let result = [...records];

    // 1. Text Search Filter (matches species or district)
    if (searchTerm.trim() !== '') {
      const query = searchTerm.toLowerCase();
      result = result.filter(
        r => r.species.toLowerCase().includes(query) || 
             r.district.toLowerCase().includes(query)
      );
    }

    // 2. Dropdown Category Filters
    if (selectedDistrict) {
      result = result.filter(r => r.district === selectedDistrict);
    }
    if (selectedSpecies) {
      result = result.filter(r => r.species === selectedSpecies);
    }
    if (selectedStatus) {
      result = result.filter(r => r.healthStatus === selectedStatus);
    }

    // 3. Sorting
    if (sortConfig.key && sortConfig.direction) {
      const { key, direction } = sortConfig;
      const isAsc = direction === 'asc';
      
      result.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];

        // Format dates for comparison if string representation
        if (key === 'plantingDate') {
          valA = new Date(valA).getTime();
          valB = new Date(valB).getTime();
        }

        // Handle string comparison vs numbers
        if (typeof valA === 'string') {
          return isAsc 
            ? valA.localeCompare(valB) 
            : valB.localeCompare(valA);
        } else {
          return isAsc 
            ? valA - valB 
            : valB - valA;
        }
      });
    }

    return result;
  }, [records, searchTerm, selectedDistrict, selectedSpecies, selectedStatus, sortConfig]);

  // Paginated View calculations
  const totalPages = Math.ceil(filteredAndSortedRecords.length / itemsPerPage) || 1;
  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedRecords.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedRecords, currentPage, itemsPerPage]);

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredAndSortedRecords.length);

  // Column Sort indicators
  const getSortClass = (key) => {
    return sortConfig.key === key && sortConfig.direction ? 'sort-active' : '';
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key || !sortConfig.direction) {
      return <ArrowUpDown size={14} className="sort-icon" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp size={14} className="sort-icon" /> 
      : <ChevronDown size={14} className="sort-icon" />;
  };

  return (
    <div className="panel-card" id="data-table-panel">
      <div className="panel-header">
        <div>
          <h2 className="panel-title">Agroforestry Monitoring Logs</h2>
          <p className="panel-subtitle">Filter, search, and sort tree species planting records</p>
        </div>
        <button 
          className="btn-icon" 
          onClick={handleResetFilters} 
          title="Reset all filters & sorting"
          id="btn-reset-filters"
        >
          <RefreshCw size={16} />
        </button>
      </div>

      {/* Filter and search controls */}
      <div className="table-controls">
        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            id="search-input"
            type="text"
            className="input-search"
            placeholder="Search by district or tree species..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="filter-wrapper">
          <select
            id="filter-district"
            className="select-filter"
            value={selectedDistrict}
            onChange={(e) => {
              setSelectedDistrict(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Districts</option>
            {uniqueDistricts.map(dist => (
              <option key={dist} value={dist}>{dist}</option>
            ))}
          </select>

          <select
            id="filter-species"
            className="select-filter"
            value={selectedSpecies}
            onChange={(e) => {
              setSelectedSpecies(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Species</option>
            {uniqueSpecies.map(sp => (
              <option key={sp} value={sp}>{sp}</option>
            ))}
          </select>

          <select
            id="filter-status"
            className="select-filter"
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Health Statuses</option>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="table-responsive">
        <table className="data-table" id="agroforestry-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('district')} className={getSortClass('district')} id="th-district">
                <span className="th-content">District {renderSortIcon('district')}</span>
              </th>
              <th onClick={() => handleSort('species')} className={getSortClass('species')} id="th-species">
                <span className="th-content">Tree Species {renderSortIcon('species')}</span>
              </th>
              <th onClick={() => handleSort('treesPlanted')} className={getSortClass('treesPlanted')} id="th-treesPlanted">
                <span className="th-content">Trees Planted {renderSortIcon('treesPlanted')}</span>
              </th>
              <th onClick={() => handleSort('plantingDate')} className={getSortClass('plantingDate')} id="th-plantingDate">
                <span className="th-content">Planting Date {renderSortIcon('plantingDate')}</span>
              </th>
              <th onClick={() => handleSort('healthStatus')} className={getSortClass('healthStatus')} id="th-healthStatus">
                <span className="th-content">Health Status {renderSortIcon('healthStatus')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedRecords.length > 0 ? (
              paginatedRecords.map((record) => (
                <tr key={record.id} id={`row-record-${record.id}`}>
                  <td>{record.district}</td>
                  <td style={{ fontWeight: 600 }}>{record.species}</td>
                  <td>{record.treesPlanted.toLocaleString()}</td>
                  <td>{new Date(record.plantingDate).toLocaleDateString(undefined, { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                  })}</td>
                  <td>
                    <span className={`badge-status ${record.healthStatus.toLowerCase()}`} id={`status-badge-${record.id}`}>
                      <span className="status-dot"></span>
                      {record.healthStatus}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <Filter size={32} className="empty-state-icon" />
                    <p className="empty-state-text">No agroforestry records match the selected filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {filteredAndSortedRecords.length > 0 && (
        <div className="table-footer">
          <div className="table-summary-text" id="table-summary">
            Showing <span style={{ fontWeight: 700 }}>{startIndex}</span> to <span style={{ fontWeight: 700 }}>{endIndex}</span> of <span style={{ fontWeight: 700 }}>{filteredAndSortedRecords.length}</span> records
          </div>
          
          <div className="pagination-controls">
            <button
              id="btn-prev-page"
              className="btn-page"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} style={{ display: 'block' }} />
            </button>
            
            <button
              id="btn-next-page"
              className="btn-page"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} style={{ display: 'block' }} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
