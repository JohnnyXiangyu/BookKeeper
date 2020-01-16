#include <Python.h>

static PyObject* uniqueCombinations(PyObject* self)
{
    return Py_BuildValue("s", "uniqueCombinations() return value (is of type 'string')");
}

static char uniqueCombinations_docs[] =
    "usage: uniqueCombinations(lstSortableItems, comboSize)\n";

static PyMethodDef module_methods[] = {
    {"uniqueCombinations", (PyCFunction) uniqueCombinations, 
     METH_NOARGS, uniqueCombinations_docs},
    {NULL}
};

static struct PyModuleDef Combinations =
{
    PyModuleDef_HEAD_INIT,
    "Combinations", /* name of module */
    "usage: Combinations.uniqueCombinations(lstSortableItems, comboSize)\n", /* module documentation, may be NULL */
    -1,   /* size of per-interpreter state of the module, or -1 if the module keeps state in global variables. */
    module_methods
};

PyMODINIT_FUNC PyInit_Combinations(void)
{
    return PyModule_Create(&Combinations);
}
